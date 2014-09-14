/**
* Module depedencies
 */
var fs = require('fs');
var myth = require('myth');
var imprt = require('rework-import');
var rework = require('rework');

/**
 * Expose `build`
 */

module.exports = build;

/**
 * @param {Object} options
 * @param {Function} next
 */

function build(options, next) {
  
  var preview = options.preview;
  var isMain = preview.filename === options.style;
  var css = isMain ? preview.content : fs.readFileSync(options.style, 'utf8');

  try {
    var converted = rework(css)
      .use(imprt({
        transform: function(content, filename) {
          return filename === preview.filename ? preview.content : content;
        }
      }))
      .use(myth())
      .toString({sourcemap: options.debug});
    fs.writeFile(options.out + '.css', converted, function(e) {
      next(e);
    });
  } catch (e) {
    next(e);
  }
}
