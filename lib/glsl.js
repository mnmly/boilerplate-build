/**
 * Module dependencies
 */

var path = require('path')
var from = require('new-from')
var deparser = require('glsl-deparser')
var glslifyStream = require('glslify-stream')

/**
 * Expose `build`
 */

module.exports = build;

/**
 * @param {Object} options
 * @param {Function} next
 */

function build(options, next) {

  var o = options.preview
  var ext = path.extname(o.filename).replace(/\./, '')
  var stream = glslifyStream(o.filename, {input: true})
  var content = ''

  from([o.content]).pipe(stream)
  stream.pipe(deparser()).on('data', function(d) {
    content += d;
  })
  stream.on('error', function(e) {
    next(e)
  })
  stream.on('end', function() {
    next(null, content)
  })
}
