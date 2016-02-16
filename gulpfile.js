var gulp = require('gulp'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-minify-css'),
    docco = require("gulp-docco");
    clean = require('gulp-clean');
    jsmin = require('gulp-jsmin');
    jshint = require('gulp-jshint');


// Lint JavaScript
gulp.task('lint', function() {
    return gulp.src('./dev/js/*.js')
               .pipe(jshint())
               .pipe(jshint.reporter('default'));
});

//Let's clean our 'dist' directory
gulp.task('cleanDist', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean({force: true}));
});

//Clean documentation
gulp.task('cleanDoc', function () {
    return gulp.src('./documentation', {read: false})
        .pipe(clean({force: true}));
});


//Then we copy ou html files
gulp.task('html', function () {
    return gulp.src(['./dev/*.html'])
        .pipe(gulp.dest('./dist'));
});

//We minify css files
gulp.task('minify-css', function() {
  return gulp.src('./dev/css/**')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));
});

//We minify js files
gulp.task('jsmin', function () {
    return gulp.src('dev/js/**/*.js')
        .pipe(jsmin())
        .pipe(gulp.dest('./dist/js'));
});

//We produce documentation
gulp.task('docco', function(){
    return gulp.src("./dev/js/**/*.js")
            .pipe(docco())
            .pipe(gulp.dest('./documentation'))
});


gulp.task('watch', function() {
    gulp.watch(['lint', 'html', 'minify-css', 'jsmin', 'docco']);
});

gulp.task('clean', ['cleanDist', 'cleanDoc']);
gulp.task('build', ['lint', 'html', 'minify-css', 'jsmin', 'docco', 'watch'])
gulp.task('default', ['build'] );

