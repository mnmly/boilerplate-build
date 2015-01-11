/**
* Module depedencies
 */
var fs = require('fs');
var path = require('path');
var myth = require('myth');
var imprt = require('rework-import');
var rework = require('rework');
var whitespace = require('css-whitespace');

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
  var preview = options.preview;
  var isMain = preview && (preview.filename === options.style);
  var css = isMain ? preview.content : fs.readFileSync(options.style, 'utf8');

  try {
    var converted = rework(css)
      .use(imprt({
        path: [ options.baseDir ],
        transform: function(content, filename) {

          var content;

          if (preview) {
            content = filename === preview.filename ? preview.content : content;
          }

          if (content.search('{') === -1) {
            try {
              content = whitespace(content)
            } catch (e) {
              next(e);
            }
          }
          return content;
        }
      }))
      .use(myth())
      .toString({sourcemap: options.debug});
    fs.writeFile(out + '.css', converted, function(e) {
      next(e);
    });
  } catch (e) {
    next(e);
  }
}
