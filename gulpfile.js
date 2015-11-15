'use strict';

var gulp = require('gulp');

// load plugins
var $               = require('gulp-load-plugins')();
var karmaCommonConf = require('./karma-common-conf.js');
var shell           = require('gulp-shell');
var server          = require("./server");
var exec            = require('child_process').exec;
var gp              = require('gulp-protractor');


// Download and update the selenium driver
gulp.task('wdm_update', gp.webdriver_update);


gulp.task('scripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('assets',  function () {

  if (gulp.env.production) {
    return gulp.src(['app/vendor/**/*.*',
      'app/MAPS/**/*.*',
      'app/public/**/*.*',
      'app/components/**/*.png',
      'app/*.png'], {base: 'app'})
      .pipe(gulp.dest('build'));
  }
});

function stringEndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isMainFile(file) {
  return stringEndsWith(file.relative, 'main.html');
}

gulp.task('html', ['assets', 'scripts'], function () {
    var assets = $.useref.assets();

  if (gulp.env.production) {
    return gulp.src(['app/*.html','app/components/**/*.html'], {base: 'app'})
      .pipe($.if(isMainFile, $.rename('index.html')))
      .pipe(assets)
      .pipe($.tap(function (file) {
        console.log(file.path);
      }))
      .pipe($.if('app/components/index.min.js', $.browserify({debug: true})))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss()))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe(gulp.dest('build'));
  } else {
    return gulp.src(['app/main.html'], {base: 'app'})
      .pipe($.tap(function (file) {
        console.log(file.path);
      }))
      .pipe($.if(isMainFile, $.rename('index.html')))
      .pipe(assets)
      .pipe($.tap(function (file) {
        console.log(file.path);
      }))
      .pipe($.if('app/components/index.min.js', $.browserify({debug: true})))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe(gulp.dest('app'));
  }
});

gulp.task('build', ['html', 'wdm_update']);

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(karmaCommonConf.files)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('dummyDB', shell.task([
  'pwd',
  './run_db_create.sh opinions'
], {
  cwd: './dbScripts/'
}));

gulp.task('e2e', ['wdm_update', 'dummyDB', 'server'], function() {

  return gulp.src('./test/e2e/*.js')
    .pipe(gp.protractor({
      configFile: 'protractor_conf.js'
    }))
    .on('error', function(e){
      throw e;
    })
    .on('end', function() {
      //Need to stop the server
      server.stop();
      process.exit(0);
    });
});


gulp.task('default', function () {
    gulp.start('build');
    gulp.start('test');
    gulp.start('e2e');
});

gulp.task('server', ['html'], function () {
  if (gulp.env.production) {
    return server.start("production");
  } else {
    return server.start();
  }
});

gulp.task('serve', ['build', 'server'], function () {
  var server = $.livereload();


  console.log(gulp.env);
  if (gulp.env.production) {
    require('opn')("http://localhost");
  } else
  {
    require('opn')("http://localhost:9000");
  }
});
