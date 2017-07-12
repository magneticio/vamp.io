/* @flow */

/* File: gulpfile.js */

// grab our gulp packages
const gulp  = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const merge = require('merge-stream');
const concat = require('gulp-concat')
const env = require('./env.json');
const inject = require('gulp-inject-string');
const fs = require('fs');

gulp.task('sass:dev', function() {
    const sassStream = gulp.src('./themes/vamp-theme/static/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}));

    const cssStream = gulp.src('./themes/vamp-theme/static/css/vendor/*.css')
        .pipe(concat('css-files.css'));

    const mergedStream = merge(sassStream, cssStream)
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./themes/vamp-theme/static/css'));
    return mergedStream;
});


const jsLibsBase = './themes/vamp-theme/static/js/libs/';

gulp.task('js', function() {
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'lunrjs.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./themes/vamp-theme/static/js/'));
});

let developmentBase = '\n<script type="text/javascript">';
developmentBase +='\ntheBaseUrl = "http://" + location.host + "/";';
developmentBase +='\ndocument.write(\'<base href="\' + theBaseUrl + \'"/>\');';
developmentBase +='\n</script>';

const prodUrl = env.prod.baseUrl;
const stagingUrl = env.staging.baseUrl;

let productionBase = '\n<script type="text/javascript">';
productionBase +='\ntheBaseUrl = "'+ prodUrl + '";';
productionBase +='\n</script>';

let stagingBase = '\n<script type="text/javascript">';
stagingBase +='\ntheBaseUrl = "'+ stagingUrl + '";';
stagingBase +='\n</script>';

gulp.task('set-base:development', [], function() {
    fs.writeFileSync('./themes/vamp-theme/layouts/partials/base-url.html', developmentBase);
});

gulp.task('set-base:staging', [], function() {
    fs.writeFileSync('./themes/vamp-theme/layouts/partials/base-url.html', '\n'+stagingBase+'\n<base href="'+ stagingUrl + '" />');
});

gulp.task('set-base:production', [], function() {
  fs.writeFileSync('./themes/vamp-theme/layouts/partials/base-url.html', '\n'+productionBase+'\n<base href="'+ prodUrl + '" />');
});

gulp.task('build-search-index',['sass:dev'], shell.task(['node ./buildSearchIndex.js']));
gulp.task('hugo', ['sass:dev', 'build-search-index'], shell.task(['hugo']));

gulp.task('build:prod', ['hugo', 'set-base:production', 'js']);
gulp.task('build:staging', ['hugo', 'set-base:staging', 'js']);
gulp.task('build:dev', ['hugo', 'set-base:development', 'js']);

