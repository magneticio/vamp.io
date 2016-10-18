/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var del = require('del');
var imagemin = require('gulp-imagemin');

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

gulp.task('move:menu', ['move:js', 'move:css'], function() {
  return gulp.src('./src/static/menu.json')
    .pipe(gulp.dest('./themes/vamp-theme/static'))
});

gulp.task('move:toml', ['move:js', 'move:css'], function() {
  return gulp.src('./src/theme.toml')
    .pipe(gulp.dest('./themes/vamp-theme'))
});

gulp.task('images', ['move:js', 'move:css'], function() {
  return gulp.src('./src/static/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./themes/vamp-theme/static/img'))
})


gulp.task('clean:moved', ['move:js', 'move:css'], function() {
  return del(['./themes/vamp-theme/layouts/css', './themes/vamp-theme/layouts/js'])
})

gulp.task('build', ['dependencies', 'move:js', 'move:css', 'clean:moved', 'move:menu', 'move:toml', 'images']);
gulp.task('build-quick', ['dependencies', 'move:js', 'move:css', 'clean:moved', 'move:menu', 'move:toml']);

