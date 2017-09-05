/* @flow */

/* File: gulpfile.js */

// grab our gulp packages
const gulp  = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const merge = require('merge-stream');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('sass:dev', function() {
    const sassStream = gulp.src('./themes/vamp-theme/static/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}));

    const cssStream = gulp.src('./themes/vamp-theme/static/css/vendor/*.css')
        .pipe(concat('css-files.css'));

    const mergedStream = merge(sassStream, cssStream)
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./themes/vamp-theme/static/css'));
    return mergedStream;
});

const jsLibsBase = './themes/vamp-theme/static/js/libs/';

gulp.task('js', function() {
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'lunrjs.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js', jsLibsBase + 'jquery.webui-popover.min.js', jsLibsBase + 'typed.min.js'])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./themes/vamp-theme/static/js/'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('./themes/vamp-theme/static/js/'));

    gulp.src('./themes/vamp-theme/static/js/app.js')
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('./themes/vamp-theme/static/js/'))

});

gulp.task('hugo:prod',shell.task(['hugo --baseUrl https://vamp.io']));
gulp.task('hugo:staging',shell.task(['hugo --baseUrl http://staging.vamp.io']));
gulp.task('hugo:dev',shell.task(['hugo']));


gulp.task('build:prod',['hugo:prod','sass:dev', 'js']);
gulp.task('build:staging',['hugo:staging','sass:dev', 'js']);
gulp.task('build:dev',['hugo:dev','sass:dev', 'js']);

gulp.task('watch', function () {
  gulp.watch('themes/vamp-theme/static/js/**/*.js',['js']);
  gulp.watch('themes/vamp-theme/static/scss/**/*.scss',['sass:dev']);
});
