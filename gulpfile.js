var gulp = require('gulp'),
    concat = require('gulp-concat'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    clean = require('gulp-clean'),
    exit = require('gulp-exit');
    

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
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .on('end', livereload('.js'))

  // Client
  browserify('./app/client/client.js').on('error', function(err) {
    console.log(err);
    return err;
  }).bundle()
    .on('error', function (err) {
      console.log(err);
      return err;
    })
    .pipe(source('./app/client/client.js'))
    .pipe(streamify(uglify()))
    .pipe(streamify(concat('app.min.js')))
    .pipe(gulp.dest('build'))
    .on('end', livereload('.js'))
});


gulp.task('css', function () {
  // Bower
  gulp.src(bower_components.css)
    .pipe(minifycss())
    .pipe(concat('bower.min.css'))
    .pipe(gulp.dest('build'))
    .on('end', livereload('.css'))

  // App
  gulp.src('app/client/styles/app.less')
    .pipe(less()).on('error', function (error) {
      console.log(error.message);
      return error;
    })
    .pipe(minifycss())
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

gulp.task('run', [
  'default',
  'watch',
  'server'
]);

gulp.task('build', [
  'js', 'css', 'html', 'images',
]);


gulp.task('default', ['build']);
