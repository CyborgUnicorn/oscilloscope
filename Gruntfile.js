module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // Concats the js files into a single include
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'public/javascripts/oscilloscope.js'
      }
    },

    // Jshints the src files
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      beforeconcat: ['src/**/*.js'],
      afterconcat: ['public/javascripts/oscilloscope.js']
    },

    // Runs mocha tests in phantomjs
    mocha: {
      all: {
        src: [ 'test/client/**/*.html' ],
        options: {
          reporter: 'Spec'
        }
      }
    },

    // Watches files to trigger tasks
    regarde: {
      js: {
        files: 'src/**/*.js',
        tasks: ['concat', 'jshint', 'mocha'],
        spawn: true
      },
      test: {
        files: ['test/client/**/*.html', 'test/client/spec/**/*.js'],
        tasks: ['mocha'],
        spawn: true
      }
    }


  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-regarde');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'jshint', 'mocha', 'regarde']);

};