var gulp    = require('gulp'),
    util   = require('gulp-util'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    gulpWebpack = require('gulp-webpack'),
    sass    = require('gulp-sass'),
    path    = require('path'),
    connect = require('gulp-connect'),
    notify  = require('gulp-notify'),
    autoprefixer = require('autoprefixer'),
    fileinclude = require('gulp-file-include'),
    postcss = require('gulp-postcss');

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

gulp.task('sass', () => {
  let sassOptions = {
    includePaths: [
      './node_modules/bootstrap/scss',
      './node_modules/font-awesome/scss',
      './node_modules/flickity/css'
    ]
  }

  if (config.production) {
    sassOptions.outputStyle = "compressed";
  }

  let plugins = [
    autoprefixer({browsers: ['last 2 versions'], cascade: false})
  ];

  gulp.src('./src/styles/app.scss')
    .pipe(sass(sassOptions))
    .on("error", notify.onError(error => {
      return "Error: " + error.message;
    }))
    .pipe(postcss(plugins))
    .on("error", notify.onError(error => {
      return "Error: " + error.message;
    }))
    .pipe(gulp.dest(config.dest + '/assets'))
    .pipe(connect.reload());
});

gulp.task('html', [], () => {
  gulp.src(['./src/*.html'])
    .pipe(fileinclude({
      basepath: './src/html_partials',
      context: {
        robots: true
      },
      indent: true
    }))
    .on("error", notify.onError(error => {
      return "Error: " + error.message;
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload())
})

gulp.task('copy-assets', () => {
  gulp.src('./node_modules/font-awesome/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src('./node_modules/slick-carousel/slick/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src('./src/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src(['./src/images/*', './src/images/**/*'])
    .pipe(gulp.dest(config.dest + '/assets/images'));
});

gulp.task('connect', () => {
  connect.server({
    port: 3000,
    root: config.dest,
    livereload: true
  });
});

gulp.task('watch', ['connect', 'build'], () => {
  gulp.watch(['./src/styles/*', './src/styles/**/*'], ['sass']);
  gulp.watch(['./src/html_partials/*', './src/*.html'], ['html']);
  gulp.watch(['./src/scripts/*'], ['webpack']);
  gulp.watch(['./src/images/*'], ['copy-assets']);
});

gulp.task('build', ['html', 'copy-assets', 'webpack', 'sass']);

gulp.task('default', ['build']);