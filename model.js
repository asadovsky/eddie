// Model interface.

var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Model, EventEmitter);
module.exports = Model;

function Model() {
  EventEmitter.call(this);
}

// Returns true iff this value is paused, in which case local mutations are
// disallowed.
Model.prototype.paused = function() {
  throw new Error('not implemented');
};

Model.prototype.getText = function() {
  throw new Error('not implemented');
};

Model.prototype.getSelectionRange = function() {
  throw new Error('not implemented');
};

Model.prototype.insertText = function(pos, value) {
  return this.replaceText(pos, 0, value);
};

Model.prototype.deleteText = function(pos, len) {
  return this.replaceText(pos, len, '');
};

// Replaces 'len' characters, starting at position 'pos', with 'value'.
// Assumes line breaks have been canonicalized to \n.
Model.prototype.replaceText = function(pos, len, value) {
  throw new Error('not implemented');
};

Model.prototype.setSelectionRange = function(start, end) {
  throw new Error('not implemented');
};

Model.prototype.undo = function() {
  throw new Error('not implemented');
};

Model.prototype.redo = function() {
  throw new Error('not implemented');
};
