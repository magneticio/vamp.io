/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var del = require('del');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject-string');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');
var env = require('./env.json');
var merge = require('merge-stream');
var concat = require('gulp-concat');



gulp.task('serve', ['browser-sync', 'build:dev'], function() {
  gulp.watch('./src/static/scss/**/*.scss', ['bs-reload']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './public/'
    }
  });

  gulp.watch('./src/static/scss/*.scss', ['sass:dev']);
  gulp.watch('./src/static/js/*.js', ['js:dev']).on('change', browserSync.reload);

});

gulp.task('sass:dev', function() {
  var sassStream = gulp.src('./src/static/scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}));

  var cssStream = gulp.src('./src/static/css/*.css')
    .pipe(concat('css-files.css'));

  var mergedStream = merge(sassStream, cssStream)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./themes/vamp-theme/static/css'))
    .pipe(shell(['hugo']))
    .pipe(browserSync.stream());

  return mergedStream;
});

gulp.task('js:dev', function() {
  return gulp.src('./themes/vamp-theme/layouts/js/app.js')
    .pipe(gulp.dest('./themes/vamp-theme/static/js'))
});

gulp.task('bs-reload', ['build:files'], function () {
  browserSync.reload();
});

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

gulp.task('sass', function() {
  return gulp.src('./src/static/scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./src/'))
});

gulp.task('dependencies', ['clean:start', 'sass'], function() {
  return gulp.src('./src/layouts/**/*.html')
    .pipe(useref())
    .pipe(gulpif('*.css',autoprefixer({
      cascade: false
    })))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./themes/vamp-theme/layouts'))
});

gulp.task('clean:start', function() {
  return del(['./themes/vamp-theme/layouts/**/*', './themes/vamp-theme/layouts/static/css/**.*', './themes/vamp-theme/layouts/static/js/**.*'])
});


gulp.task('move:js', ['dependencies'], function() {
  return gulp.src('./themes/vamp-theme/layouts/js/*.js')
    .pipe(gulp.dest('./themes/vamp-theme/static/js'))
});

gulp.task('move:css', ['dependencies'], function() {
  return gulp.src('./themes/vamp-theme/layouts/css/*.css')
    .pipe(gulp.dest('./themes/vamp-theme/static/css'))
});

gulp.task('move:rest', function() {
  return gulp.src('./src/static/js/ZeroClipboard.swf')
    .pipe(gulp.dest('./themes/vamp-theme/static/js'));
});

gulp.task('move:menu', function() {
  return gulp.src('./src/static/menu.json')
    .pipe(gulp.dest('./themes/vamp-theme/static'))
});

gulp.task('move:toml', function() {
  return gulp.src('./src/theme.toml')
    .pipe(gulp.dest('./themes/vamp-theme'))
});

gulp.task('move:fonts', function() {
  return gulp.src('./src/static/fonts/*')
    .pipe(gulp.dest('./themes/vamp-theme/static/fonts'))
});

gulp.task('images', function() {
  return gulp.src('./src/static/img/**/*')
    .pipe(gulp.dest('./themes/vamp-theme/static/img'))
});

gulp.task('clean:moved', ['move:js', 'move:css'], function() {
  return del(['./themes/vamp-theme/layouts/css', './themes/vamp-theme/layouts/js'])
});

var developmentBase = '\n<script type="text/javascript">';
    developmentBase +='\ntheBaseUrl = "http://" + location.host + "/";';
    developmentBase +='\ndocument.write(\'<base href="\' + theBaseUrl + \'"/>\');';
    developmentBase +='\n</script>';


var prodUrl = env.prod.baseUrl;

var productionBase = '\n<script type="text/javascript">';
    productionBase +='\ntheBaseUrl = "'+ prodUrl + '";';
    productionBase +='\n</script>';


gulp.task('set-base:development', ['dependencies'], function() {
  return gulp.src('./themes/vamp-theme/layouts/partials/head.html')
    .pipe(inject.after('<head>',  developmentBase))
    .pipe(gulp.dest('./themes/vamp-theme/layouts/partials'))
});

gulp.task('set-base:production', ['dependencies'], function() {
  return gulp.src('./themes/vamp-theme/layouts/partials/head.html')
    .pipe(inject.after('<head>',  '\n'+productionBase+'\n<base href="'+ prodUrl + '" />'))
    .pipe(gulp.dest('./themes/vamp-theme/layouts/partials'))
});

gulp.task('build-search-index',['dependencies'], shell.task(['node ./buildSearchIndex.js']));
gulp.task('hugo', ['dependencies', 'build-search-index'], shell.task(['hugo']));

gulp.task('build:prod', ['build:files', 'set-base:production', 'images', 'build-search-index', 'hugo']);
gulp.task('build:dev', ['build:files', 'set-base:development', 'images', 'build-search-index', 'hugo']);
gulp.task('build:files', ['dependencies', 'move:js', 'move:css', 'move:fonts', 'clean:moved', 'move:menu', 'move:rest', 'move:toml']);

