/*
 * grunt-asset-cachebuster
 * https://github.com/gillesruppert/grunt-asset-cachebuster
 *
 * Copyright (c) 2013 Gilles Ruppert
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    asset_cachebuster: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options.css': ['test/fixtures/images.css'],
          'tmp/default_options.html': ['test/fixtures/index.html'],
        },
      },
      buster_option: {
        options: {
          buster: '0.2.0'
        },
        files: {
          'tmp/buster_option.css': ['test/fixtures/images.css'],
          'tmp/buster_option.html': ['test/fixtures/index.html'],
        }
      },
      buster_function_option: {
        options: {
          buster: function (url) {
            return url.length;
          }
        },
        files: {
          'tmp/buster_function_option.css': ['test/fixtures/images.css'],
          'tmp/buster_function_option.html': ['test/fixtures/index.html'],
        }
      },
      ignore_option: {
        options: {
          buster: '0.2.0',
          ignore: [
            'cdn.1.test.com',
            '//cdn.2.test.com',
          ]
        },
        files: {
          'tmp/ignore_option.css': ['test/fixtures/images.css'],
          'tmp/ignore_option.html': ['test/fixtures/index.html'],
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'asset_cachebuster', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
