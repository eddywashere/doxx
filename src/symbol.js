'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Symbol = (function () {
  function Symbol() {
    _classCallCheck(this, Symbol);
  }

  /**
   * Checks if a tag has a specific type
   * @param  {string}  val value to check against
   * @returns {function}  A function that evaluates the truth
   * when True if `tag` type is `val`
   */

  _createClass(Symbol, null, [{
    key: 'has',
    value: function has(val) {
      return function (tag) {
        return tag.type === val;
      };
    }

    /**
     * Compacts multi-line expression
     * @returns {Array}
     */
  }, {
    key: 'compact',
    value: function compact(tags) {

      /*[{"type":"description",
      "string":"Note: if `addClass` is defined at the step level."},
       {"type":"",
       "string": "The two defined `addClass` 
       will be taken into account in the popover"},
       {"type":"type","types":["String"]}]*/
      var compacted = [];

      tags.forEach(function (tag, i) {
        if (!tag.type) {
          if (i === 0) {
            return;
          }
          // Append to previous
          var prevTag = compacted[compacted.length - 1];
          if (prevTag.description) {
            prevTag.description += ' ' + tag.string;
          } else {
            prevTag.string += ' ' + tag.string;
          }
          return;
        }

        compacted.push(tag);
      });

      return compacted;
    }

    /**
     * Maps symbols
     * @private
     * @param {Object} symbol
     * @returns {Object}
     */
  }, {
    key: 'map',
    value: function map(symbol) {
      symbol.tags = Symbol.compact(symbol.tags);
      var tags = {};
      ['type', 'description', 'example', 'file', 'fileoverview', 'overview', 'param', 'require', 'jsFiddle', 'return'].forEach(function (tag) {
        tags[tag.toLowerCase() + 's'] = symbol.tags.filter(Symbol.has(tag));
      });
      var types = tags.types;
      var descriptions = tags.descriptions;
      var examples = tags.examples;
      var files = tags.files;
      var fileoverviews = tags.fileoverviews;
      var overviews = tags.overviews;
      var returns = tags.returns;
      var requires = tags.requires;
      var jsfiddles = tags.jsfiddles;

      if (symbol.tags.length > 0 && symbol.tags.filter(Symbol.has('param')).length > 0) {

        symbol.hasParams = true;
      }

      if (!symbol.ctx) {
        symbol.ctx = {};
      }

      if (symbol.ctx.type) {
        symbol.gtype = symbol.ctx.type;
      }

      if (types.length === 1) {
        symbol.type = types[0].types.join(' | ');
      }

      if (files.length === 1) {
        symbol.file = files[0].type;
        symbol.fileString = files[0].string;
        symbol.fileHtml = files[0].html;
      }

      if (fileoverviews.length === 1) {
        symbol.files = fileoverviews[0].type;
        symbol.fileString = fileoverviews[0].string;
        symbol.fileHtml = fileoverviews[0].html;
      }

      if (overviews.length === 1) {
        symbol.files = overviews[0].type;
        symbol.fileString = overviews[0].string;
        symbol.fileHtml = overviews[0].html;
      }

      if (returns.length !== 0) {
        symbol.returns = [];
        returns.forEach(function (returned) {
          symbol.returns.push(returned);
        });
      }

      if (examples.length !== 0) {
        symbol.examples = [];
        examples.forEach(function (example) {
          symbol.examples.push(example.string);
        });
      }

      if (requires.length !== 0) {
        symbol.requires = [];
        requires.forEach(function (required) {
          symbol.requires.push(required.string);
        });
      }

      symbol.description.extra = '';
      if (descriptions.length === 1) {
        symbol.description.extra = '<p>' + descriptions[0].string + '</p>';
      }

      if (jsfiddles.length === 1) {
        symbol.jsfiddle = jsfiddles[0].string;
      }

      return symbol;
    }
  }]);

  return Symbol;
})();

exports['default'] = Symbol;
module.exports = exports['default'];
//# sourceMappingURL=source maps/symbol.js.map