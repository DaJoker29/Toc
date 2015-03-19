module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            live: {
                options: { livereload: true },
                files: ['*'],
                tasks: ['jsdoc']
            }
        },
        jsdoc: {
            live: {
                src: ['toc.js'],
                options: {
                    access: 'all',
                    readme: 'README.md',
                    package: 'package.json'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['jsdoc', 'watch']);
};