// Implementation of Editor interface.
//
// TODO:
// - Disallow non-ASCII characters
// - Check for race conditions

var _ = require('lodash');
var inherits = require('inherits');

var constants = require('./constants');
var EditorInterface = require('./editor');
var LocalModel = require('./local_model');
var util = require('./util');

inherits(Editor, EditorInterface);
module.exports = Editor;

////////////////////////////////////////////////////////////////////////////////
// Editor

function Editor(el, model) {
  EditorInterface.call(this);
  this.el_ = el;

  _.assign(this.el_.style, constants.editorStyle, {
    padding: '0',
    overflowY: 'hidden'
  });

  this.ta_ = document.createElement('textarea');
  _.assign(this.ta_.style, constants.baseStyle, {
    display: 'block',
    margin: '0',
    border: '0',
    padding: constants.editorStyle.padding,
    width: '100%',
    height: '100%',
    font: constants.editorStyle.font,
    lineHeight: '1.2',
    outline: 'none',
    resize: 'none'
  });
  this.el_.appendChild(this.ta_);

  // Register input handlers. Use 'input' event to catch text mutations, and
  // various other events to catch selection mutations.
  this.ta_.addEventListener('input', this.handleInput_.bind(this));

  var handler = this.updateSelection_.bind(this);
  this.ta_.addEventListener('input', handler);
  this.ta_.addEventListener('keydown', handler);
  this.ta_.addEventListener('mousedown', handler);
  this.ta_.addEventListener('mousemove', handler);
  this.ta_.addEventListener('select', handler);
  window.addEventListener('blur', this.blur.bind(this));

  this.reset(model);
}

////////////////////////////////////////////////////////////////////////////////
// Public methods

Editor.prototype.reset = function(model) {
  this.m_ = model || new LocalModel();

  // Register model event handlers.
  this.m_.on('replaceText', this.handleReplaceText_.bind(this));
  this.m_.on('setSelectionRange', this.handleSetSelectionRange_.bind(this));

  // Handle non-empty initial model state.
  this.ta_.value = this.m_.getText();
};

Editor.prototype.focus = function() {
  this.ta_.focus();
};

Editor.prototype.blur = function() {
  this.ta_.blur();
};

Editor.prototype.getText = function() {
  return this.m_.getText();
};

Editor.prototype.getSelectionRange = function() {
  return this.m_.getSelectionRange();
};

////////////////////////////////////////////////////////////////////////////////
// Model event handlers

Editor.prototype.handleReplaceText_ = function(e) {
  if (e.isLocal) {
    return;
  }
  this.ta_.value = this.m_.getText();
  this.handleSetSelectionRange_(e);
};

Editor.prototype.handleSetSelectionRange_ = function(e) {
  if (e.isLocal) {
    return;
  }
  // If this editor has focus, update its selection range.
  if (document.activeElement === this.ta_) {
    var selRange = this.m_.getSelectionRange();
    this.ta_.setSelectionRange(Math.min(selRange[0], selRange[1]),
                               Math.max(selRange[0], selRange[1]));
  }
};

////////////////////////////////////////////////////////////////////////////////
// Input event handlers

Editor.prototype.handleInput_ = function(e) {
  if (this.m_.paused()) {
    e.preventDefault();
    return;
  }

  var oldText = this.m_.getText();
  var newText = util.canonicalizeLineBreaks(this.ta_.value);

  // Note, oldText may be equal to newText, e.g. if user selects all, then
  // copies, then pastes.
  var minLen = Math.min(oldText.length, newText.length);
  var l = 0, r = 0;
  while (l < minLen && oldText.charAt(l) === newText.charAt(l)) l++;
  while (l + r < minLen && (oldText.charAt(oldText.length - 1 - r) ===
                            newText.charAt(newText.length - 1 - r))) r++;

  var insertLen = newText.length - r - l;
  var deleteLen = oldText.length - r - l;
  console.assert(insertLen >= 0, insertLen);
  console.assert(deleteLen >= 0, deleteLen);

  this.m_.replaceText(l, deleteLen, newText.substr(l, insertLen));
};

Editor.prototype.updateSelection_ = function(e) {
  if (this.m_.paused()) {
    e.preventDefault();
    return;
  }
  var that = this;
  window.setTimeout(function() {
    // TODO: Canonicalize line breaks.
    that.m_.setSelectionRange(that.ta_.selectionStart, that.ta_.selectionEnd);
  }, 0);
};
