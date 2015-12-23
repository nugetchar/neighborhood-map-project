var gulp = require('gulp'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-minify-css');
 
gulp.task('html', function () {
    var assets = useref.assets();
 
    return gulp.src(['./**/*.html', './**/*.png', './**/*.jpg'])
        .pipe(assets)
        .pipe(gulpif('./**/*.js', uglify()))
        .pipe(gulpif('./**/*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('../dist'));
});


gulp.task('minify-css', function() {
  return gulp.src('./**/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('../dist'));
});


gulp.task('compress', function() {
  return gulp.src('./**/*.js')
    .pipe(uglify())
    .on('error', function(){})
    .pipe(gulp.dest('../dist'));
});

gulp.task('watch', function() {
    gulp.watch(['html', 'minify-css', 'compress']);
});


gulp.task('default', ['html', 'minify-css', 'compress', 'watch']);
