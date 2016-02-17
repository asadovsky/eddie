// Implementation of Model interface.

var inherits = require('inherits');

var ev = require('./events');
var ModelInterface = require('./model');

inherits(Model, ModelInterface);
module.exports = Model;

function Model(initialText) {
  ModelInterface.call(this);
  // TODO: Use a rope data structure, e.g. the jumprope npm package.
  this.text_ = initialText || '';
  this.selStart_ = 0;
  this.selEnd_ = 0;
}

Model.prototype.paused = function() {
  return false;
};

Model.prototype.getText = function() {
  return this.text_;
};

Model.prototype.getSelectionRange = function() {
  return [this.selStart_, this.selEnd_];
};

Model.prototype.replaceText = function(pos, len, value) {
  this.text_ = this.text_.substr(0, pos) + value + this.text_.substr(pos + len);
  this.selStart_ = pos + value.length;
  this.selEnd_ = this.selStart_;
  this.emit('replaceText', new ev.ReplaceText(true, pos, len, value));
};

Model.prototype.setSelectionRange = function(start, end) {
  this.selStart_ = start;
  this.selEnd_ = end;
  this.emit('setSelectionRange', new ev.SetSelectionRange(true, start, end));
};
