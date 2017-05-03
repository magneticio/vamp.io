/* @flow */

/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var merge = require('merge-stream');
var concat = require('gulp-concat')
var env = require('./env.json');
var inject = require('gulp-inject-string');
var fs = require('fs');

gulp.task('sass', function() {
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


var jsLibsBase = './themes/vamp-theme/static/js/libs/';

gulp.task('js', function() {
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'lunrjs.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./themes/vamp-theme/static/js/'));
});

// set environment variables
var baseUrl = '!';
if (gutil.env.env == 'production') {
    baseUrl = env.prod.baseUrl;
} else {
    baseUrl = env.dev.baseUrl;
}

gulp.task('build-search-index',['sass'], shell.task(['node ./buildSearchIndex.js']));
gulp.task('hugo', ['sass', 'build-search-index'], shell.task(['hugo'], { env: {'HUGO_BASEURL': baseUrl }}));

gulp.task('build', ['hugo', 'js']);

