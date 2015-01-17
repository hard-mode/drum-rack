var
  gulp       = require('gulp'),
  gulpJade   = require('gulp-jade'),
  gulpStylus = require('gulp-stylus');


gulp.task('jade', function () {
  return gulp.src('src/ui.jade')
    .pipe(gulpJade(
      { jade:   require('jade'),
        pretty: true }))
    .pipe(gulp.dest('dist/'));
});


gulp.task('stylus', function () {
  return gulp.src('src/ui.styl')
    .pipe(gulpStylus())
    .pipe(gulp.dest('dist/'));
});


gulp.task('default', function () {

  gulp.start('stylus');
  gulp.watch('src/ui.styl', ['stylus']);

  gulp.start('jade');
  gulp.watch('src/ui.jade', ['jade']);

});
