var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var inline = require('gulp-inline-source');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('default', ['minify', 'compress']);

gulp.task('minify', function() {
  return gulp.src('src/index.html')
    .pipe(inline())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compress', function(cb) {
    pump([
        gulp.src('src/js/main.js'),
        uglify(),
        gulp.dest('dist/js/')
    ],
    cb
    );
});
