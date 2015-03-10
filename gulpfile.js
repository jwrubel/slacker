var gulp = require('gulp'),
    util = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon');
    

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
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('build'));

  // Client
  browserify('./app/client/client.js')
    .bundle()
    .on('error', util.log.bind(util, 'Browserify Error'))
    .pipe(source('app.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('build'));
});


gulp.task('css', function () {
  // Bower
  gulp.src(bower_components.css)
    .pipe(minifycss())
    .pipe(concat('bower.min.css'))
    .pipe(gulp.dest('build'));

  // App
  gulp.src('app/client/styles/app.less')
    .pipe(less())
    .on('error', util.log.bind(util, 'Less Error'))
    .pipe(minifycss({ processImport: false }))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('build'));
});


gulp.task('html', function () {
  gulp.src('app/views/*.html')
    .pipe(gulp.dest('build'));
});


gulp.task('images', function () {
  gulp.src('app/client/images/*')
    .pipe(gulp.dest('build'));
});


gulp.task('server', function () {
  nodemon({
    script: 'app/server/server.js',
    ext: 'js',
    ignore: ['gulpfile.js', 'app/client/*'],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('error', function (error) {
    return error;
  });
});


gulp.task('watch', function() {
  gulp.watch(['app/**/*.js', 'bower_components/**/*.js'], ['js']);
  gulp.watch(['app/**/*.less', 'bower_components/**/*.css'], ['css']);
  gulp.watch(['app/**/*.html'], ['html']);
  gulp.watch(['app/**/*.png', 'app/**/*.jpg'], ['images']);
});

gulp.task('run', ['default', 'watch', 'server']);
gulp.task('build', ['js', 'css', 'html', 'images']);


gulp.task('default', ['build']);
