'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var util = require('gulp-util');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');

var MANIFEST = {
  js: {
    clientMain: 'src/js/app.js',
    clientAll: 'src/js/**/*.js',
    server: 'index.js'
  },
  templates: {
    all: 'src/**/*.html'
  },
  css: {
    all: 'src/css/**/*.css'
  }
};

function buildScript (src, watch) {
  var props = watchify.args;
  props.entries = [src];
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle () {
    util.log('Bundling');
    // todo: find a way to avoid piping to dest here
    // ideally we could tack on any additional streams here
    return bundler.bundle()
      .on('end', function () {
        util.log('Finished bundling');
      })
      .on('error', function (err) {
        util.log('Bundle ', err, err.stack);
      })
      .pipe(source('app.js'))
      .pipe(gulp.dest('dist/js'));
  }

  bundler.on('update', rebundle);

  return rebundle();
}

gulp.task('dev', function () {
  nodemon({
    script: MANIFEST.js.server,
    ext: 'js html',
    watch: 'server'
  });
  // Nick's Eslint linting
  //gulp.watch([MANIFEST.js.clientAll, MANIFEST.js.serverAll], ['lint']);
  gulp.watch([MANIFEST.templates.all], ['templates']);
  buildScript(MANIFEST.js.clientMain, true);
});

gulp.task('js', function () {
  return buildScript(MANIFEST.js.clientMain);
});

gulp.task('templates', function () {
  return gulp.src(MANIFEST.templates.all, {})
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', function () {
  return gulp.src(MANIFEST.css.all, {})
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['templates', 'css', 'js']);
gulp.task('default', ['dev']);
