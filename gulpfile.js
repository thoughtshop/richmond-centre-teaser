var gulp    = require('gulp'),
    ifElse = require('gulp-if-else'),
    util   = require('gulp-util'),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    webpackStream = require('webpack-stream'),
    haml    = require('gulp-ruby-haml'),
    sass    = require('gulp-sass'),
    path    = require('path'),
    refresh = require('gulp-livereload'),
    connect = require('gulp-connect'),
    cache   = require('gulp-cached'),
    notify  = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer');

var config = {
  dest: util.env.production ? './dist' : './build',
  production: util.env.production,
  webpackConfig: util.env.production ? require("./webpack.prod.config.js") : require("./webpack.config.js")
};

gulp.task('webpack', () => {
  return webpackStream(config.webpackConfig, webpack)
    .on('error', notify.onError(error => {
      return "Error: " + error.message
    }))
    .pipe(gulp.dest(config.dest + '/assets'))
    .pipe(connect.reload());
});

gulp.task('sass', function() {
  let options = {
    includePaths: [
      './node_modules/bootstrap/scss',
      './node_modules/font-awesome/scss',
      './node_modules/slick-carousel/slick'
    ]
  }

  if (config.production) {
    options.outputStyle = "compressed";
  }

  gulp.src(['./src/styles/app.scss'])
    .pipe(sass(options))
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest + '/assets'))
    .pipe(connect.reload());
});

gulp.task('haml', function() {
  gulp.src('./src/haml/*.haml')
    .pipe(cache('haml'))
    .pipe(haml())
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});

gulp.task('copy-assets', function() {
  gulp.src('./node_modules/font-awesome/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src('./node_modules/slick-carousel/slick/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src('./src/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src(['./src/images/*', './src/images/**/*'])
    .pipe(gulp.dest(config.dest + '/assets/images'));
});

gulp.task('connect', function() {
  connect.server({
    port: 3000,
    root: config.dest,
    livereload: true
  });
});

gulp.task('watch', ['connect', 'build'], function() {
  gulp.watch(['./src/styles/*', './src/styles/**/*'], ['sass']);
  gulp.watch('./src/haml/*', ['haml']);
  gulp.watch('./src/scripts/*', ['webpack']);
});

gulp.task('build', ['copy-assets', 'webpack', 'haml', 'sass']);

gulp.task('default', ['build']);
