module.exports = {
  stripPrefix: '.build/',
  staticFileGlobs: [
    '.build/manifest.json',
    '.build/index.html',
    '.build/src/**/*',
    '.build/fonts/**/*',
    '.build/images/**/*',
    '.build/scripts/**/*',
    '.build/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '.build/bower_components/intl/dist/Intl.min.js',
    '.build/bower_components/intl/locale-data/json/en.json',
    '.build/bower_components/es6-promise/es6-promise.auto.min.js',
    '.build/bower_components/fetch/fetch.js',
    '.build/bower_components/intl-messageformat/dist/intl-messageformat.min.js',
    '.build/bower_components/intl-messageformat/dist/locale-data/en.js'
  ],
  navigateFallback: 'index.html',
  navigateFallbackWhitelist: [/^(?!\/__)/]
};
