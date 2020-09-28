import gulp from 'gulp'
import minimist from 'minimist'
import autoprefixer from 'gulp-autoprefixer'
import changedInPlace from 'gulp-changed-in-place'
import cleanCSS from 'gulp-clean-css'
import del from 'del'
import eslint from 'gulp-eslint'
import stylelint from 'gulp-stylelint'
import gulpConnect from 'gulp-connect'
import htmlmin from 'gulp-htmlmin'
import imageMin from 'gulp-imagemin'
import fileinclude from 'gulp-file-include'
import ifElse from 'gulp-if-else'
import notify from 'gulp-notify'
import sass from 'gulp-sass'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'

const argv = minimist(process.argv.slice(2))

const config = {
  dest: argv.production ? './dist' : './build',
  production: argv.production,
  webpackConfig: argv.production ? require("./webpack.prod.config.js") : require("./webpack.config.js")
};

export const clean = () => {
  return del([config.dest]);
};

export const js = () => {
  return webpackStream(config.webpackConfig, webpack)
    .on('error', notify.onError(error => {
      this.emit('end');
      return "Error: " + error.message
    }))
    .pipe(gulp.dest(config.dest + '/assets'))
    .pipe(gulpConnect.reload());
};

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

const jsLint = () => {
  return gulp.src([
    './src/scripts/*.js',
    './src/scripts/**/*.js',
    './src/scripts/**/**/*.js'
  ], {base: './src/scripts/'})
    .pipe(changedInPlace())
    .pipe(eslint())
    .pipe(eslint.format());
};

export const jsLintAll = () => {
  return gulp.src([
    './src/scripts/*.js',
    './src/scripts/**/*.js',
    './src/scripts/**/**/*.js'
  ], {base: './src/scripts/'})
    .pipe(eslint({
      fix: argv.fix
    }))
    .pipe(eslint.format())
    .pipe(ifElse(isFixed, () => gulp.dest('./src/scripts/')));
};

export const css = () => {
  const options = {
    includePaths: [
      './node_modules/bootstrap/scss',
      './node_modules/font-awesome/scss'
    ]
  }

  return gulp.src('./src/styles/app.scss')
    .pipe(sass( options ))
    .pipe(autoprefixer({
      cascade: false,
      grid: true
    }))
    .pipe(ifElse(
      config.production,
      () => cleanCSS()
    ))
    .pipe(ifElse(
      config.production,
      () => rename((path) => {
        path.basename += ".min"
      })
    ))
    .pipe(gulp.dest(config.dest + '/assets'))
    .pipe(gulpConnect.reload());
};

const cssLint = () => {
  return gulp.src([
    './src/styles/*.scss',
    './src/styles/**/*.scss',
    './src/styles/**/**/*.scss'
  ], {base: './src/styles/'})
    .pipe(changedInPlace())
    .pipe(stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      failAfterError: false
    }));
};

export const cssLintAll = () => {
  return gulp.src([
    './src/styles/*.scss',
    './src/styles/**/*.scss',
    './src/styles/**/**/*.scss'
  ], {base: './src/styles/'})
    .pipe(stylelint({
      fix: argv.fix,
      reporters: [
        { formatter: 'string', console: true }
      ],
      failAfterError: false
    }))
    .pipe(gulp.dest('./src/styles/'));
};

export const html = (done) => {
  return gulp.src([
    './src/html/*.html',
    './src/html/tc/*.html',
    './src/html/sc/*.html'
  ], {
    base: './src/html/'
  }).pipe(fileinclude({
      basepath: './src/html/_partials',
      context: {
        production: config.production ? true : false,
        robots: true,
        seoTitle: ""
      },
      indent: true
    }))
    .on("error", notify.onError(error => {
      return "Error: " + error.message;
    }))
    .pipe(ifElse(
      config.production,
      () => htmlmin({collapseWhitespace: true})
    ))
    .on("error", notify.onError(error => {
      return "Error: " + error.message;
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(gulpConnect.reload())
};

export const copyAssets = (done) => {
  // Copy all fonts
  gulp.src([
    './src/fonts/*.{ttf,woff,woff2,eof,svg}',
    './node_modules/font-awesome/fonts/*.{ttf,woff,woff2,eof,svg}',
    './node_modules/slick-carousel/slick/fonts/*.{ttf,woff,woff2,eof,svg}'
  ]).pipe(gulp.dest(config.dest + '/assets/fonts'));

  gulp.src(['./src/images/*', './src/images/**/*'])
    .pipe(ifElse(config.production,
      () => {
        return imageMin([
          imageMin.jpegtran({progressive: true})
        ], {verbose: true})
    }))
    .pipe(gulp.dest(config.dest + '/assets/images'));

  gulp.src(['./src/registration.php'])
    .pipe(gulp.dest(config.dest + '/assets'));

  gulp.src(['./src/documents/*'])
    .pipe(gulp.dest(config.dest + '/assets/documents'));

  done();
};

const connect = (done) => {
  gulpConnect.server({
    port: 3000,
    root: config.dest,
    livereload: true
  });
  
  done();
}

const watchFiles = () => {
  gulp.watch(['./src/styles/*', './src/styles/**/*'], gulp.parallel(cssLint, css));
  gulp.watch(['./src/html/*', './src/html/**/*'], html);
  gulp.watch([
    './src/scripts/*',
    './src/scripts/**/*',
    './src/scripts/**/**/*'
  ], gulp.parallel(jsLint, js));
  gulp.watch(['./src/registration.php', './src/images/*', './src/images/**/*'], copyAssets);
};

export const lintAll = gulp.parallel(cssLintAll, jsLintAll);
export const deploy = gulp.series(clean, gulp.parallel(copyAssets, css, html, js));
export const build = gulp.parallel(copyAssets, html, gulp.series(cssLintAll, css), gulp.series(jsLintAll, js));
export const watch = gulp.series(gulp.parallel(connect, build), watchFiles);

export default build;
