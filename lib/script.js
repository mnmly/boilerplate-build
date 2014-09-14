/**
* Module depedencies
 */

var fs = require('fs');
var through = require('through');
var Browserify = require('browserify');
var streams = {};

/**
 * Expose `build`
 */

module.exports = build;

/**
 * @param {Object} options
 * @param {Function} next
 */

function build(options, next) {

  var out = options.out;
  var browserify = Browserify(options);
  var stream;

  browserify.require(options.browser || options.main, {expose: options.name || 'boot'});
  browserify.transform(options.preview, transform);

  if (streams[out]) {
    stream = streams[out];
    stream.end();
  }

  stream = streams[out] = fs.createWriteStream(out + '.js');

  stream.on('finish', function() {
    streams[out] = null;
    next(null);
  });

  browserify
    .bundle()
    .on('error', function(err) {
      next(err);
      this.end();
    })
    .pipe(stream);
}

function transform(file, opts) {

  return opts.filename === file ? through(write, end) : through();

  function write (buf) {}
  function end () {
    this.queue(opts.content);
    this.queue(null);
  }
}
