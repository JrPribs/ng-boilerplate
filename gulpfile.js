var path = require('path'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    myth = require('gulp-myth'),
    htmlmin = require('gulp-htmlmin'),
    connect = require('gulp-connect'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css'),
    protractor = require("gulp-protractor").protractor,
    debug = false,
    WATCH_MODE = 'watch',
    RUN_MODE = 'run';

var mode = WATCH_MODE;

function changeNotification(event) {
  console.log('File', event.path, 'was', event.type, ', running tasks...');
}

gulp.task('uglify-js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('copy-js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('public/js'));
});

gulp.task('minify-template', function() {
  gulp.src('src/template/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public/template'));
});

gulp.task('copy-template', function() {
  gulp.src('src/template/**/*.html')
    .pipe(gulp.dest('public/template'));
});

gulp.task('myth', function () {
  gulp.src('src/css/**/*.css')
    .pipe(myth())
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'));
});

gulp.task('copy-css', function() {
  gulp.src('src/css/**/*.css')
    .pipe(gulp.dest('public/css'));
});

gulp.task('lint', function () {
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
    }));
});

gulp.task('protractor', function() {
  gulp.src(["./src/tests/*.js"])
    .pipe(protractor({
      configFile: 'protractor.conf.js',
      args: ['--baseUrl', 'http://127.0.0.1:8080']
    }))
    .on('error', function() {});
});

function build() {
  var jsTask = debug ? 'copy-js' : 'uglify-js',
      templateTask = debug ? 'copy-template' : 'minify-template';

  console.log('template task', templateTask);

  var jsWatcher = gulp.watch('src/js/**/*.js', [jsTask, 'karma', 'protractor']),
      cssWatcher = gulp.watch('src/css/**/*.css', ['myth']),
      htmlWatcher = gulp.watch('src/template/**/*.html', [templateTask, 'protractor']),
      testWatcher = gulp.watch('test/**/*.js', ['karma', 'protractor']);

  jsWatcher.on('change', changeNotification);
  cssWatcher.on('change', changeNotification);
  htmlWatcher.on('change', changeNotification);
  testWatcher.on('change', changeNotification);
}

gulp.task('default', ['uglify-js', 'myth', 'minify-template', 'lint', 'karma', 'protractor'], build);

gulp.task('debug', ['debug-mode', 'copy-js', 'copy-css', 'copy-template', 'lint', 'karma', 'protractor'], build);

gulp.task('connect', function() {
  gulp.watch(['public/**/*', 'index.html'], function() {
    gulp.src(['public/**/*', 'index.html'])
      .pipe(connect.reload());
  });

  connect.server({
    livereload: true
  });
});

gulp.task('server', ['connect', 'default']);

gulp.task('kill-connect', function() {
  connect.serverClose();
});

gulp.task('run-mode', function() {
  mode = RUN_MODE;
});

gulp.task('debug-mode', function() {
  debug = true;
});

gulp.task('test', ['run-mode', 'connect', 'uglify-js', 'protractor', 'kill-connect']);
