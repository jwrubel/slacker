var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    exit = require('gulp-exit'),
    htmlmin = require('gulp-htmlmin');


var livereloadSever = livereload();

var bower_components = {
  js: [
    './bower/angular/angular.js',
    './bower/angular-route/angular-route.js',
    './bower/angular-classy/angular-classy.js'
  ],
  css: [
    './bower/bootstrap-css/css/bootstrap.css'
  ]
};


gulp.task('js', function () {
  // Bower
  gulp.src(bower_components.js)
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(livereload());

  // App
  gulp.src('app/app.js')
    .pipe(browserify({ debug: true })).on('error', function (error) {
      console.log("\n\nError: " + error.message + "\n\n");
      return error;
    })
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});


gulp.task('css', function () {
  // Bower
  gulp.src(bower_components.css)
    .pipe(minifycss())
    .pipe(concat('bower.min.css'))
    .pipe(gulp.dest('build'))
    .pipe(livereload());

  // App
  gulp.src('app/styles/app.scss')
    .pipe(sass()).on('error', function (error) {
      console.log(error.message);
      return error;
    })
    .pipe(minifycss())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});


gulp.task('html', function () {
  gulp.src('app/views/*.html')
    .pipe(htmlmin({
      caseSensitive: true,
      removeComments: true,
      collapseWhitespace: true
    })).on('error', function (error) {
      console.log(error);
      return error;
    })
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});


gulp.task('images', function () {
  gulp.src('app/images/*')
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});


gulp.task('server', function () {
  nodemon({ 
    script: 'app/server.js', 
    ext: 'js', 
    ignore: ['gulpfile.js', 'scripts/*'], 
    env: { 
      'NODE_ENV': 'development' 
    }
  }).on('error', function (error) {
    return error;
  });
});


gulp.task('clean', function () {
  gulp.src(['./build'], { read: false })
    .pipe(clean())
    .pipe(exit());
});


gulp.task('watch', function () {
  gulp.watch(['app/**/*.js', 'bower_components/**/*.js'], ['js']);
  gulp.watch(['app/**/*.scss', 'bower_components/**/*.css'], ['css']);
  gulp.watch(['app/**/*.html'], ['html']);
  gulp.watch(['app/**/*.png', 'app/**/*.jpg'], ['images']);
});


gulp.task('default', [
  'js', 'css', 'html', 'images',
  'watch', 
  'server'
]);