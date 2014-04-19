var gulp        = require('gulp'),
  concat        = require('gulp-concat'),
  templateCache = require('gulp-angular-templatecache'),
  ngmin         = require('gulp-ngmin'),
  less          = require('gulp-less'),
  path          = require('path'),
  clean         = require('gulp-clean'),
  gutil         = require('gulp-util'),
  gulpif        = require('gulp-if'),
  uglify        = require('gulp-uglify'),
  imagemin      = require('gulp-imagemin'),
  linker        = require('gulp-linker'),
  build         = require('gulp-build'),
  bg            = require('gulp-bg'),
  bowerSrc      = require('gulp-bower-src'),
  filter        = require('gulp-filter'),
  jst           = require('gulp-jstemplater'),
  proxy             = require('proxy-middleware'),
  coffee            = require('gulp-coffee'),
  sass              = require('gulp-ruby-sass'),
  url               = require('url'),
  express           = require('express'),
  connectLiveReload = require('connect-livereload'),
  SprocketsChain    = require("sprockets-chain");
var scJS = new SprocketsChain();
scJS.appendPath("./vendor");
scJS.appendPath("./lib/js");

var EXPRESS_PORT = 9000;
var EXPRESS_ROOT = './build';
var LIVERELOAD_PORT = 35729;
var filter = filter('**/*.js', '!**/*.min.js');

err = null;
// Let's make things more readable by
// encapsulating each part's setup
// in its own method

function startExpress() {
  var app = express();
  app.use(connectLiveReload());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}

// We'll need a reference to the tinylr
// object to send notifications of file changes
// further down
var lr;

function startLivereload() {
  lr = require('tiny-lr')();
  lr.listen(LIVERELOAD_PORT);
}

// Notifies livereload of changes detected
// by `gulp.watch()`

function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = path.relative(EXPRESS_ROOT, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });
};

paths = {
  input: {
    js: scJS.depChain("vendor.js"),
    coffee: ["./lib/js/core/dom.js.coffee",
      "./lib/js/core/jqueryContentMatcher.js.coffee",
        "./lib/js/core/core.js.coffee"
      ],
    bookmarklet:"./lib/js/bookmarklet.js",
    html:"./lib/*.html",
    templates:"./lib/html/*.html",
    css: "./lib/css/**.css"

  },
  out: {
    coffee:"coffee.js",
    js: "schlepless.js"
  }
}
replace_options = { BASE_URL: 'http://localhost:9000' }
gulp.task('coffee',function() {
  return gulp.src(paths.input.coffee)
  .pipe(coffee()).pipe(concat("schlepless.js"))
  .pipe(gulp.dest("./tmp"))
});

gulp.task('copy-index',function() {
    return gulp.src(paths.input.html)
    .pipe(build(replace_options))
    .pipe(gulp.dest("./build/"))
});

gulp.task('css', function () {
    return gulp.src(paths.input.css)
        .pipe(concat("styles.css"))
        .pipe(gulp.dest('build'));
});

gulp.task('jst', function() {
    gulp.src('lib/html/*.html')
        .pipe(jst( "html.js", {variable: "TMPL"} ) )
        .pipe(gulp.dest('./tmp'));
});
gulp.task("bower", function(){
    bowerSrc()
      .pipe(filter).pipe(concat('bower.js'))
      .pipe(gulp.dest('./tmp/'));
});

gulp.task('copy-bookmarklet',function() {
    return gulp.src(paths.input.bookmarklet)
    .pipe(build(replace_options))
    .pipe(gulp.dest("./build"))
});

gulp.task('vendor',function() {
    return gulp.src(paths.input.js)
    .pipe(concat("assets.js"))
    .pipe(gulp.dest("./tmp"))
});

gulp.task('scripts',["coffee","vendor","jst"],function() {
    return gulp.src("./tmp/**.js")
    .pipe(concat("schlepless.js"))
    .pipe(gulp.dest("./build"))
});

gulp.task('watch', function() {
  gulp.watch([
    'build/**/*.html',
    'build/*.html',
    'build/**/*.js',
    'build/**/*.css'
  ], notifyLivereload);
  gulp.watch(paths.input.templates, ['jst']);
  gulp.watch(paths.input.htmlIndex, ['copy-html']);
  gulp.watch(paths.input.bookmarklet, ['copy-bookmarklet']);
  gulp.watch(paths.input.js, ['vendor']);
  gulp.watch("./tmp/*.js", ['scripts']);
  gulp.watch(paths.input.css, ['css']);
  gulp.watch(paths.input.coffee, ['coffee']);
});

gulp.task('connect', function(cb) {
  startExpress()
  startLivereload()
  cb(err); // if err is not null and not undefined, the orchestration will stop, and 'two' will not run
});

gulp.task('default',["scripts","css","copy-index","copy-bookmarklet","connect","watch"], function() {

  // place code for your default task here
});
