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

var productionUrl = 'magneticio.github.io/revamp.io/';
var developmentUrl = 'location.host';


gulp.task('browser-sync', function() {
  browserSync({
    ui: {
      port: 1314
    },
    proxy: "localhost:1313",
    reloadDelay: 500
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('set-environment-development', function () {
  gulp.src(['./layouts/partials/head.tmp.html'])
    .pipe(insert.prepend('<script>var theBaseUrl = '+ developmentUrl +' </script>'))
    .pipe(rename('./layouts/partials/head.html'))
    .pipe(gulp.dest('./'));
});

gulp.task('set-environment-production', function () {
  gulp.src(['./layouts/partials/head.tmp.html'])
    .pipe(insert.prepend('<script>var theBaseUrl = "'+ productionUrl +'" </script>'))
    .pipe(rename('./layouts/partials/head.html'))
    .pipe(gulp.dest('./'));
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