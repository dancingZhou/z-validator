var gulp = require('gulp')
var gutil = require('gulp-util')
var babel = require('gulp-babel')

gulp.task('dev', ['default'])

gulp.task('default', function () {
  gulp.watch('src/**/*.*', function () {
    gulp.src('src/**/*.js')
      .pipe(babel())
      .on('error', function (err) {
        gutil.log(err)
        this.end()
      })
      .pipe(gulp.dest('dist'))
    gulp.src('src/**/*.html')
      .pipe(gulp.dest('dist'))
  })
})

gulp.task('build', function () {
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
})
