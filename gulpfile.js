var path = require('path'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    myth = require('gulp-myth'),
    htmlmin = require('gulp-htmlmin'),
    connect = require('gulp-connect'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css'),
    webdriverUpdate = require("gulp-protractor").webdriver_update,
    protractor = require("gulp-protractor").protractor,
    debug = false,
    WATCH_MODE = 'watch',
    RUN_MODE = 'run';

var mode = WATCH_MODE;

gulp.task('js', function() {
  var jsTask = gulp.src('src/js/**/*.js');
  if (!debug) {
    jsTask.pipe(uglify());
  }
  jsTask.pipe(gulp.dest('public/js'));
});

gulp.task('template', function() {
  var templateTask = gulp.src('src/template/**/*.html');
  if (!debug) {
    templateTask.pipe(htmlmin({ collapseWhitespace: true }));
  }
  templateTask.pipe(gulp.dest('public/template'));
});

gulp.task('css', function() {
  var cssTask = gulp.src('src/css/**/*.css')
    .pipe(myth())
    .pipe(gulp.dest('public/css'));
  if (!debug) {
    cssTask.pipe(minifyCSS());
  }
  cssTask.pipe(gulp.dest('public/css'));
});

gulp.task('lint', function() {
  gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('karma', function() {
  // undefined.js: unfortunately necessary for now
  gulp.src(['undefined.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: mode
    }))
    .on('error', function() {});
});

gulp.task('webdriver-update', webdriverUpdate);

gulp.task('protractor', ['webdriver-update'], function(callback) {
  gulp.src(["./src/tests/*.js"])
    .pipe(protractor({
      configFile: 'protractor.conf.js',
      args: ['--baseUrl', 'http://127.0.0.1:8080']
    }))
    .on('end', function() { callback(); })
    .on('error', function() { callback(); });
});

gulp.task('connect', function() {
  gulp.watch(['public/**/*', 'index.html'], function() {
    gulp.src(['public/**/*', 'index.html'])
      .pipe(connect.reload());
  });

  connect.server({
    livereload: true
  });
});

gulp.task('kill-connect', ['protractor'], function() {
  connect.serverClose();
});

gulp.task('run-mode', function() {
  mode = RUN_MODE;
});

gulp.task('debug', function() {
  debug = true;
});

function changeNotification(event) {
  console.log('File', event.path, 'was', event.type, ', running tasks...');
}

function watch() {
  var jsWatcher = gulp.watch('src/js/**/*.js', ['js', 'lint', 'karma', 'protractor']),
      cssWatcher = gulp.watch('src/css/**/*.css', ['css']),
      htmlWatcher = gulp.watch('src/template/**/*.html', ['template', 'protractor']),
      testWatcher = gulp.watch('test/**/*.js', ['karma', 'protractor']);

  jsWatcher.on('change', changeNotification);
  cssWatcher.on('change', changeNotification);
  htmlWatcher.on('change', changeNotification);
  testWatcher.on('change', changeNotification);
}

gulp.task('all', ['js', 'lint', 'karma', 'protractor']);

gulp.task('default', ['all'], watch);

gulp.task('server', ['connect', 'default']);

gulp.task('test', ['run-mode', 'debug', 'connect', 'all', 'kill-connect']);
