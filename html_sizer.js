// HtmlSizer class.

var _ = require('lodash');

module.exports = HtmlSizer;

function HtmlSizer(parentEl, style) {
  this.el_ = document.createElement('div');
  _.assign(this.el_.style, style, {
    position: 'fixed',
    top: '-1000px',
    left: '-1000px',
    visibilty: 'hidden',
    whiteSpace: 'pre'
  });
  parentEl.appendChild(this.el_);
}

HtmlSizer.prototype.size = function(html) {
  this.el_.innerHTML = html;
  // Note, getBoundingClientRect returns fractional width and height.
  var rect = this.el_.getBoundingClientRect();
  var res = [rect.width, rect.height];
  this.el_.innerHTML = '';
  return res;
};

HtmlSizer.prototype.width = function(html) {
  return this.size(html)[0];
};

HtmlSizer.prototype.height = function(html) {
  return this.size(html)[1];
};
