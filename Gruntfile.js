module.exports = function(grunt) {
    grunt.initConfig({
        cacheBust: {
          options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 16
          },
          assets: {
              files: [{
                  src: ['static/css/*.css']
              }]
          }
        },        
        clean: ["dist/css","public/css/*"],
        less: {
            production: {
                options: {
                    paths: ["static/less"]
                },
                files: [
                    {"static/css/ui.css": "static/less/app.less"},
                    {"static/css/flat-ui.css": "static/vendor/theme/flat-ui/less/flat-ui.less"}
                ]
            }
        },
        watch: {
            styles: {
                files: ['static/less/*.less'],
                tasks: ['clean','less','cssmin','cacheBust'],
                options: {
                    nospawn: true
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'static/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'static/css',
                    ext: '.min.css'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.registerTask('default', ['watch']);
};

