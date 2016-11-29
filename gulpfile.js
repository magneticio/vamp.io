/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var merge = require('merge-stream');
var concat = require('gulp-concat');


gulp.task('sass:dev', function() {
    var sassStream = gulp.src('./themes/vamp-theme/static/scss/style.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}));
  
    var cssStream = gulp.src('./themes/vamp-theme/static/css/vendor/*.css')
      .pipe(concat('css-files.css'));
  
    var mergedStream = merge(sassStream, cssStream)
      .pipe(concat('style.css'))
      .pipe(gulp.dest('./themes/vamp-theme/static/css'));
    return mergedStream;
});

gulp.task('build-search-index',['sass:dev'], shell.task(['node ./buildSearchIndex.js']));
gulp.task('hugo', ['sass:dev', 'build-search-index'], shell.task(['hugo']));

gulp.task('build:prod', ['hugo']);

