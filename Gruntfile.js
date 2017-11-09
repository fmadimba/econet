module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsbeautifier: {
            files: ['src/**/*.html'],
            options: {}
        },
        accessibility: {
            options: {
                accessibilityLevel: 'WCAG2A'
            },
            test: {
                src: ['src/**/*.html']
            }
        },
        'http-server': {
            'dev': {
                root: 'src/',
                port: 8282,
                host: "0.0.0.0",
                ext: "html",
                runInBackground: false
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: true,
                compress: false,
                beautify: false
            },
            build: {
                src: [
                    'src/_js/econet.full.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'dist/css/econet/style.css': 'src/_scss/style.scss',
                    'dist/css/econet/old_ie_style.css': 'src/_scss/old_ie_style.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/_js/**/*.js', 'src/_scss/**/*.scss'],
                tasks: ['sass', 'uglify'],
                options: {
                    spawn: false,
                },
            },
        },
        'sftp-deploy': {
            build: {
                auth: {
                    host: 'frontend.ardev.us',
                    authKey: 'privateKey'
                },
                cache: 'sftpCache.json',
                src: 'src/',
                dest: '/www/development/<%= pkg.name %>',
                exclusions: ['build/', 'node_module/', 'Gruntfile.js', 'package.json', 'readme.md', '.sass-cache', '.git', '.gitignore'],
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        },
        replace: {
            cdn: {
                src: ['src/**/*.html', 'src/_js/*.js', 'src/_scss/*.scss'],
                overwrite: true,
                replacements: [{
                    from: 'http://www.army.mil/e2/',
                    to: '/e2/'
                }, {
                    from: 'http://frontend.ardev.us/api/',
                    to: 'http://www.army.mil/api/'
                }]
            },
            dev: {
                src: ['src/**/*.html', 'src/_js/*.js', 'src/_scss/*.scss'],
                overwrite: true,
                replacements: [{
                    from: /\/e2\//g,
                    to: 'http://www.army.mil/e2/'
                }, {
                    from: 'http://www.army.mil/api/',
                    to: 'http://frontend.ardev.us/api/'
                }]
            }
        }
    });


    grunt.loadNpmTasks('grunt-sftp-deploy');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-http-server');

    grunt.loadNpmTasks('grunt-accessibility');

    grunt.loadNpmTasks("grunt-jsbeautifier");

    grunt.loadNpmTasks('grunt-text-replace');

    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', ['sass', 'uglify', 'http-server']);

    grunt.registerTask('dev', ['replace:dev']);

    grunt.registerTask('cdn', ['replace:cdn']);

};
