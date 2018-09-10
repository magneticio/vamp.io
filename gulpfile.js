const gulp  = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const merge = require('merge-stream');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const hash = require('gulp-hash');
const del = require('del')


gulp.task('sass', function() {
    del('./themes/vamp/static/css/dist/**/*')
    const sassStream = gulp.src('./themes/vamp/static/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}));

    const cssStream = gulp.src('./themes/vamp/static/css/vendor/*.css')
        .pipe(concat('css-files.css'));

    const mergedStream = merge(sassStream, cssStream)
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(hash())
        .pipe(gulp.dest('./themes/vamp/static/css/dist/'))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/css"));
    return mergedStream;
});

const jsLibsBase = './themes/vamp/static/js/libs/';
const jsAppsBase = './themes/vamp/static/js/apps/';


gulp.task('js', function() {
    del('./themes/vamp/static/js/dist/**/*')
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js', jsLibsBase + 'jquery.webui-popover.min.js', jsLibsBase + 'slick.min.js'])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./themes/vamp/static/js/dist/'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(hash())
      .pipe(gulp.dest('./themes/vamp/static/js/dist/'))
      .pipe(hash.manifest("hash.json"))
      .pipe(gulp.dest("data/js"));

    gulp.src('./themes/vamp/static/js/index.js')
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(hash())
      .pipe(gulp.dest('./themes/vamp/static/js/dist/'))
      .pipe(hash.manifest("hash.json"))
      .pipe(gulp.dest("data/js"));

    gulp.src('./themes/vamp/static/js/apps.js')
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(hash())
      .pipe(gulp.dest('./themes/vamp/static/js/dist/'))
      .pipe(hash.manifest("hash.json"))
      .pipe(gulp.dest("data/js"));

});

gulp.task('hugo:prod',shell.task(['hugo --baseUrl https://vamp.io']));
gulp.task('hugo:staging',shell.task(['hugo --baseUrl http://staging.vamp.io']));
gulp.task('hugo:vamp-ee-staging',shell.task(['hugo --baseUrl http://vamp-ee-staging.vamp.io']));
gulp.task('hugo:dev',shell.task(['hugo']));


gulp.task('build:prod',['sass', 'js']);
gulp.task('build:staging',['sass', 'js']);
gulp.task('build:dev',['sass', 'js']);

gulp.task('watch', function () {
  gulp.watch(['themes/vamp/static/js/**/*.js','!themes/vamp/static/js/dist/*.js'],['js']);
  gulp.watch('themes/vamp/static/scss/**/*.scss',['sass']);
});
