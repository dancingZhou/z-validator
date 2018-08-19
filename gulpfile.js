var gulp = require('gulp')
var babel = require('gulp-babel')

gulp.task('default', function () {
  gulp.watch('src/**/*.*', function () {
    gulp.src('src/**/*.js')
      .pipe(babel())
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
