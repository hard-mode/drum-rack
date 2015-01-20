var
  gulp       = require('gulp'),
  gulpJade   = require('gulp-jade'),
  gulpStylus = require('gulp-stylus'),
  liveReload = require('gulp-livereload');


gulp.task('jade', function () {
  return gulp.src('ui/*.jade')
    .pipe(gulpJade(
      { jade:   require('jade'),
        client: true,
        self:   true,
        pretty: false }))
    .pipe(gulp.dest('dist/'))
    .pipe(liveReload());
});


gulp.task('stylus', function () {
  return gulp.src('ui/*.styl')
    .pipe(gulpStylus())
    .pipe(gulp.dest('dist/'))
    .pipe(liveReload());
});


gulp.task('default', function () {

  liveReload.listen();

  gulp.start('stylus');
  gulp.watch('ui/*.styl', ['stylus']);

  gulp.start('jade');
  gulp.watch('ui/*.jade', ['jade']);

});
