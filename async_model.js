// Implementation of Model interface.

var inherits = require('inherits');

var ev = require('./events');
var ModelInterface = require('./model');

inherits(Model, ModelInterface);
module.exports = Model;

function Model(handler, initialText) {
  ModelInterface.call(this);
  this.paused_ = false;
  this.handler_ = handler;
  // TODO: Use a rope data structure, e.g. the jumprope npm package.
  this.text_ = initialText || '';
  this.selStart_ = 0;
  this.selEnd_ = 0;
}

Model.prototype.paused = function() {
  return this.paused_;
};

Model.prototype.getText = function() {
  return this.text_;
};

Model.prototype.getSelectionRange = function() {
  return [this.selStart_, this.selEnd_];
};

Model.prototype.replaceText = function(pos, len, value) {
  if (this.paused_) {
    throw new Error('paused');
  }
  if (len === 0 && value.length === 0) {
    return;
  }
  this.paused_ = true;
  this.handler_.handleReplaceText(pos, len, value);
};

Model.prototype.setSelectionRange = function(start, end) {
  if (this.paused_) {
    throw new Error('paused');
  }
  if (this.selStart_ === start && this.selEnd_ === end) {
    return;
  }
  // TODO: Set this.paused_ and notify handler. For now, we simply update local
  // state and emit an event.
  this.selStart_ = start;
  this.selEnd_ = end;
  this.emit('setSelectionRange', new ev.SetSelectionRange(true, start, end));
};

// Note: A single call to Model.replaceText can result in multiple calls to
// Model.applyReplaceText.
Model.prototype.applyReplaceText = function(isLocal, pos, len, value) {
  if (isLocal) {
    this.paused_ = false;
  }
  if (len === 0 && value.length === 0) {
    return;
  }
  var t = this.text_;
  if (pos < 0 || pos + len > t.length) {
    throw new Error('out of bounds');
  }
  this.text_ = t.substr(0, pos) + value + t.substr(pos + len);
  // Update selection range.
  if (isLocal) {
    this.selStart_ = pos + value.length;
    this.selEnd_ = this.selStart_;
  } else {
    if (this.selStart_ >= pos) {
      this.selStart_ = Math.max(pos, this.selStart_ - len) + value.length;
    }
    if (this.selEnd_ >= pos) {
      this.selEnd_ = Math.max(pos, this.selEnd_ - len) + value.length;
    }
  }
  this.emit('replaceText', new ev.ReplaceText(isLocal, pos, len, value));
};
