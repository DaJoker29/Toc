module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            live: {
                options: { livereload: true },
                files: ['*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
};