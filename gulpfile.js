var
  gulp       = require('gulp'),
  gulpJade   = require('gulp-jade'),
  gulpStylus = require('gulp-stylus'),
  liveReload = require('gulp-livereload');


gulp.task('jade', function () {
  return gulp.src('src/ui.jade')
    .pipe(gulpJade(
      { jade:   require('jade'),
        pretty: true }))
    .pipe(gulp.dest('dist/'))
    .pipe(liveReload());
});


gulp.task('stylus', function () {
  return gulp.src('src/ui.styl')
    .pipe(gulpStylus())
    .pipe(gulp.dest('dist/'))
    .pipe(liveReload());
});


gulp.task('default', function () {

  liveReload.listen();

  gulp.start('stylus');
  gulp.watch('src/ui.styl', ['stylus']);

  gulp.start('jade');
  gulp.watch('src/ui.jade', ['jade']);

});
