/**
* Module depedencies
 */

var fs = require('fs');
var path = require('path');
var through = require('through');
var Browserify = require('browserify');
var stringify = require('stringify');
var bundles = {};

/**
 * Expose `build`
 */

module.exports = build;

/**
 * @param {Object} options
 * @param {Function} next
 */

function build(options, next) {

  var out = path.resolve(options.out, options.name);

  var browserify = Browserify(options);
  var entry = options.entry;
  var stream;

  browserify.add(entry);

  if (options.requires) {
    browserify.require(entry, {expose: options.requires});
  }

  browserify.transform(options.preview, transform);
  browserify.transform(stringify(['.html']));

  if (options.transforms) {
    options.transforms.forEach(function(t) {
      browserify.transform(t);
    });
  }
  
  if (bundles[out]) {
    bundles[out].emit('error', new Error('Stream is in use.'));
  }

  stream = fs.createWriteStream(out + '.js');

  stream.on('finish', function() {
    bundles[out] = null
    next(null);
  });

  var bundle = bundles[out] = browserify.bundle()
  bundle.on('error', function(err) {
    next(err);
    this.end();
  })
  .pipe(stream)
}

function transform(file, opts) {

  return opts.filename === file ? through(write, end) : through();

  function write (buf) {}
  function end () {
    this.queue(opts.content);
    this.queue(null);
  }
}
