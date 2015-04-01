/*
 * grunt-asset-cachebuster
 * https://github.com/gillesruppert/grunt-asset-cachebuster
 *
 * Copyright (c) 2013 Gilles Ruppert
 * Licensed under the MIT license.
 */

'use strict';

var interpolate = require('interpolate');

function isCss(filepath) {
  return (/\.css$/).test(filepath);
}

function isHtml(filepath, extension) {
  var htmlTest = new RegExp('\\.' + extension + '$', 'gi');
  return htmlTest.test(filepath);
}

function bust(buster, url) {
  return (typeof buster === 'function') ? buster(url) : buster;
}

function replace(replacer, options) {
  return function _replace(match, p1) {
    if (!options.ignore.some(function (ignore) { return match.indexOf(ignore) > -1; })) {
      return interpolate(replacer, { p1: p1, buster: bust(options.buster, p1) });
    } else {
      return match;
    }
  };
}

function cacheBustCss(css, options) {
  var img = /url\(['"]?(?!data:)([^)'"?]+)['"]?(?:\?v=[0-9]+)*\)/gi;
  return css.replace(img, replace('url({p1}?v={buster})', options));
}

function cacheBustHtml(html, options) {
  var css = /href="(.+\.css)"/gi;
  html = html.replace(css, replace('href="{p1}?v={buster}"', options));

  var js = /src="(.+\.js)"/gi;
  html = html.replace(js, replace('src="{p1}?v={buster}"', options));

  var images = /src="(.+\.(?:png|gif|jpg|jpeg))"/gi;
  html = html.replace(images, replace('src="{p1}?v={buster}"', options));
  return html;
}


module.exports = function(grunt) {

  function cacheBust(src, files, options) {
    if (isCss(files.dest)) {
      grunt.file.write(files.dest, cacheBustCss(src, options));
    }
    else if (isHtml(files.dest, options.htmlExtension)) {
      grunt.file.write(files.dest, cacheBustHtml(src, options));
    } else {
      grunt.file.write(files.dest, cacheBustHtml(src, options));
    }
    grunt.log.writeln('Assets in "' + files.dest + '" cachebusted.');
  }

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('asset_cachebuster', 'Cachebust images, scripts and other assets in your HTML & CSS files.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      buster: '123456',
      ignore: [],
      htmlExtension: 'html'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(files) {
      var src = files.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) { return grunt.file.read(filepath); })
      .join(grunt.util.normalizelf(''));

      try {
        cacheBust(src, files, options);
      } catch (e) {
        grunt.log.error('ERROR:', e.message, e);
        grunt.fail.warn('Failed to cachebust assets in: ' + files.dest);
      }
    });

  });
};
