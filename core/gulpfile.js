var
  gulp        = require('gulp'),
  gulpJade    = require('gulp-jade'),
  gulpStylus  = require('gulp-stylus'),
  liveReload  = require('gulp-livereload'),
  templatizer = require('templatizer');


gulp.task('templates', function () {
  console.log('Rebuilding templates.');
  templatizer(
    __dirname + '/../ui',
    __dirname + '/../client/templates.js',
    { namespace:        'HARDMODE',
      dontRemoveMixins: true });
});


gulp.task('stylesheets', function () {
  return gulp.src('ui/*.styl')
    .pipe(gulpStylus())
    .pipe(gulp.dest('client/'))
    .pipe(liveReload());
});


gulp.task('default', function () {

  liveReload.listen();

  gulp.start('stylesheets');
  gulp.watch('ui/**/*.styl', ['stylesheets']);

  gulp.start('templates');
  gulp.watch('ui/**/*.jade', ['templates']);

});


module.exports = function () { gulp.start('default') };
