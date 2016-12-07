/* @flow */

/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var merge = require('merge-stream');
var concat = require('gulp-concat')
var env = require('./env.json');
var inject = require('gulp-inject-string');
var fs = require('fs');

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

var jsLibsBase = './themes/vamp-theme/static/js/libs/';

gulp.task('js', function() {
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'lunrjs.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./themes/vamp-theme/static/js/'));
});


var developmentBase = '\n<script type="text/javascript">';
developmentBase +='\ntheBaseUrl = "http://" + location.host + "/";';
developmentBase +='\ndocument.write(\'<base href="\' + theBaseUrl + \'"/>\');';
developmentBase +='\n</script>';


var prodUrl = env.prod.baseUrl;

var productionBase = '\n<script type="text/javascript">';
productionBase +='\ntheBaseUrl = "'+ prodUrl + '";';
productionBase +='\n</script>';


gulp.task('set-base:development', [], function() {
    fs.writeFileSync('./themes/vamp-theme/layouts/partials/base-url.html', developmentBase);
});

gulp.task('set-base:production', [], function() {
    fs.writeFileSync('./themes/vamp-theme/layouts/partials/base-url.html', '\n'+productionBase+'\n<base href="'+ prodUrl + '" />');
});

gulp.task('build-search-index',['sass:dev'], shell.task(['node ./buildSearchIndex.js']));
gulp.task('hugo', ['sass:dev', 'build-search-index'], shell.task(['hugo']));

gulp.task('build:prod', ['hugo', 'set-base:production', 'js']);
gulp.task('build:dev', ['hugo', 'set-base:development', 'js']);

