var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var insert = require('gulp-insert');
var rename = require('gulp-rename');


var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  includePaths: ['./sassLibs']
};

gulp.task('browser-sync', function() {
  browserSync({
    ui: {
      port: 1314
    },
    proxy: "localhost:1313",
    reloadDelay: 1000
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('styles', function(){
  gulp.src(['./static/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass(sassOptions))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('./static/css/'))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('default', ['browser-sync'], function(){
  gulp.watch("./static/scss/**/*.scss", ['styles']);
  gulp.watch("*.html", ['bs-reload']);
});
//
// <script>
// var theBaseUrl = 'localhost:3001';
// </script>