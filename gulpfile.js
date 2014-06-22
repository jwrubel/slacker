var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    clean = require('gulp-clean'),
    exit = require('gulp-exit');

var development = false;

var bower_components = {
  js: [
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/emitter.js/emitter.js',
    './bower_components/klass/klass.js'
  ],
  css: [
    './bower_components/bootstrap-css/css/bootstrap.css'
  ]
};


gulp.task('js', function () {
  // Bower
  gulp.src(bower_components.js)
    .pipe(concat('bower.min.js'))
    .pipe(gulpif(!development, uglify()))
    .pipe(gulp.dest('build'))
    .on('end', livereload('.js'))

  // Client
  gulp.src('app/client/client.js')
    .pipe(browserify({ debug: true })).on('error', function (error) {
      console.log("\n\nError: " + error.message + "\n\n");
      return error;
    }).on('error', function(error) {
      console.log(error);
      return error;
    })
    .pipe(gulpif(!development, uglify()))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('build'))
    .on('end', livereload('.js'))
});


gulp.task('css', function () {
  // Bower
  gulp.src(bower_components.css)
    .pipe(gulpif(!development, minifycss()))
    .pipe(concat('bower.min.css'))
    .pipe(gulp.dest('build'))
    .on('end', livereload('.css'))

  // App
  gulp.src('app/client/styles/app.less')
    .pipe(less()).on('error', function (error) {
      console.log(error.message);
      return error;
    })
    .pipe(gulpif(!development, minifycss()))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('build'))
    .on('end', livereload('.css'))
});


gulp.task('html', function () {
  gulp.src('app/views/*.html')
    .pipe(gulp.dest('build'))
    .on('end', livereload('.html'))
});


gulp.task('images', function () {
  gulp.src('app/client/images/*')
    .pipe(gulp.dest('build'))
    .on('end', livereload('.html'))
});


gulp.task('server', function () {
  nodemon({
    script: 'app/server/server.js',
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


var livereloadServer = null;
var livereload = function (_file) {
  return function (_path) {
    if (livereloadServer) livereloadServer.changed(_file);
  }
}

gulp.task('watch', function() {
  livereloadServer = require('gulp-livereload')();

  gulp.watch(['app/**/*.js', 'bower_components/**/*.js'], ['js']);
  gulp.watch(['app/**/*.less', 'bower_components/**/*.css'], ['css']);
  gulp.watch(['app/**/*.html'], ['html']);
  gulp.watch(['app/**/*.png', 'app/**/*.jpg'], ['images']);
});

gulp.task('develop', function () {
  development = true;
})

gulp.task('run', [
  'develop',
  'default',
  'watch',
  'server'
]);

gulp.task('build', [
  'js', 'css', 'html', 'images',
]);


gulp.task('default', ['build']);
