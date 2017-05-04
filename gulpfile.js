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
var inject = require('gulp-inject-string');
var fs = require('fs');

var srcDir = process.env.INIT_CWD + '/src';
var siteDir = process.env.INIT_CWD + '/site';

// set environment-dependent variables
var env = require(srcDir + '/env.json');
var baseUrl = '!';
if (gutil.env.env == 'production') {
    baseUrl = env.prod.baseUrl;
} else {
    baseUrl = env.dev.baseUrl;
}

gulp.task('build:site', function(){
    gulp.src('content/**/*', {cwd: srcDir}).pipe(gulp.dest(siteDir + '/content'));
    gulp.src('static/**/*', {cwd: srcDir}).pipe(gulp.dest(siteDir + '/static'));
    gulp.src('themes/**/*', {cwd: srcDir}).pipe(gulp.dest(siteDir + '/themes'));
    gulp.src('config.toml', {cwd: srcDir}).pipe(gulp.dest(siteDir));
})

gulp.task('build:css', ['build:site'], function() {
    process.chdir(siteDir);
    var sassStream = gulp.src('./themes/vamp-theme/static/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}));

    var cssStream = gulp.src('./themes/vamp-theme/static/css/vendor/*.css')
        .pipe(concat('css-files.css'));

    var mergedStream = merge(sassStream, cssStream)
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./themes/vamp-theme/static/css'));
    process.chdir(process.env.INIT_CWD);
    return mergedStream;
});

gulp.task('build:js', ['build:site'], function() {
    process.chdir(siteDir);
    var jsLibsBase = './themes/vamp-theme/static/js/libs/';
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'lunrjs.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./themes/vamp-theme/static/js/'));
    process.chdir(process.env.INIT_CWD);
});

gulp.task('build:search-index', ['build:site'], shell.task(['node ../src/buildSearchIndex.js'], {cwd: siteDir}));
gulp.task('build:hugo', ['build:site', 'build:css', 'build:search-index', 'build:js'], shell.task(['hugo'], { env: {'HUGO_BASEURL': baseUrl }, cwd: siteDir}));
gulp.task('build', ['build:site', 'build:hugo']);

