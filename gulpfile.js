'use strict';

const del = require('del');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const cssSlam = require('css-slam').gulp;
const htmlmin = require('gulp-html-minifier');
const inlinesource = require('gulp-inline-source');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');
const runSequence = require('run-sequence');

const polymerMainJson = require('./polymer.json');
const polymerMain = new polymerBuild.PolymerProject(polymerMainJson);

const swPrecacheConfig = require('./sw-precache-config.js');
const tmpBuildDirectory = '.tmp-build';
const buildDirectory = '.build';

/**
 * Waits for the given ReadableStream
 */
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

gulp.task('clean-tmp', () => {
  return del.sync([
    tmpBuildDirectory
  ]);
});

gulp.task('clean', ['clean-tmp'], () => {
  return del.sync([
    buildDirectory
  ]);
});

gulp.task('copy', () => {
  return gulp.src([
    '*.html',
    'fonts/**/*',
    'images/**/*',
    'scripts/**/*',
  ], {
      base: './'
    })
    .pipe(gulp.dest(tmpBuildDirectory));
});

gulp.task('copy-dist', () => {
  return gulp.src([
    '.tmp-build/src/**/*',
    '.tmp-build/bower_components/**/*',
    '.tmp-build/fonts/**/*',
    '.tmp-build/images/**/*',
    '.tmp-build/manifest.json'
  ], {
      base: tmpBuildDirectory
    })
    .pipe(gulp.dest(buildDirectory));
});

function buildPolymer(polymerJson, polymerProject) {
  polymerProject = polymerProject || new polymerBuild.PolymerProject(polymerJson);

  let sourcesStream = polymerProject.sources()
    // Oh, well do you want to minify stuff? Go for it!
    // Here's how splitHtml & gulpif work
    .pipe(polymerProject.splitHtml())
    .pipe($.if(/\.js$/, $.uglify()))
    .pipe($.if(/\.css$/, cssSlam()))
    .pipe($.if(/\.(png|gif|jpg|svg)$/, $.imagemin()))
    .pipe(polymerProject.rejoinHtml());

  // Okay, now let's do the same to your dependencies
  let dependenciesStream = polymerProject.dependencies()
    .pipe(polymerProject.splitHtml())
    .pipe($.if(/\.js$/, $.uglify()))
    .pipe($.if(/\.css$/, cssSlam()))
    .pipe(polymerProject.rejoinHtml());

  // Okay, now let's merge them into a single build stream
  let buildStream = mergeStream(sourcesStream, dependenciesStream)
    .once('data', () => {
      console.log('Analyzing build dependencies...');
    });

  // If you want bundling, pass the stream to polymerProject.bundler.
  // This will bundle dependencies into your fragments so you can lazy
  // load them.
  buildStream = buildStream.pipe(polymerProject.bundler);

  // Okay, time to pipe to the build directory
  buildStream = buildStream.pipe(gulp.dest(tmpBuildDirectory));

  // waitFor the buildStream to complete
  return buildStream;
}

gulp.task('polymer-build', () => {
  let polymerProjStream = buildPolymer(polymerMainJson, polymerMain);
  let pProj = waitFor(polymerProjStream);
  
  // waitFor the buildStream to complete
  return pProj;
});

gulp.task('build-html', () => {
  var assets = $.useref.assets({ searchPath: [tmpBuildDirectory] });
  return gulp.src(['.tmp-build/**/*.html'], {
    base: tmpBuildDirectory
  })
    .pipe(assets)
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify({ preserveComments: 'license', output: { ascii_only: true } })))
    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.cssmin()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Output Files
    .pipe(gulp.dest(buildDirectory))
    .pipe($.size({ title: 'html' }));
});

gulp.task('minify-inline', function() {
    return gulp.src('.build/**/*.html')
        .pipe(inlinesource({
            attribute: 'inline',
            rootpath: buildDirectory,
        }))
        .pipe(gulp.dest(buildDirectory))
        .pipe($.size({title: 'minify-inline'}));
});

gulp.task('build-html-minify', () => {
  return gulp.src(['.build/**/*.html'], {
    base: tmpBuildDirectory
  })
    .pipe($.if('*.html', htmlmin({
      removeComments: true,
      collapseWhitespace: true
    })))
    .pipe(gulp.dest(buildDirectory))
    .pipe($.size({ title: 'html-minify' }));
});

gulp.task('generate-service-worker', function(cb) {
  let swPrecache = require('sw-precache');

  swPrecache.write(buildDirectory + '/service-worker.js', swPrecacheConfig, cb);
});

gulp.task('build', (cb) => {
  runSequence(
    'clean',
    'copy',
    'polymer-build',
    'build-html',
    'copy-dist',
    'minify-inline',
    'build-html-minify',
    'generate-service-worker',
    'clean-tmp',
    cb);
});