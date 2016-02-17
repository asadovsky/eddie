// Editor interface.

module.exports = Editor;

function Editor() {}

Editor.prototype.reset = function(model) {
  throw new Error('not implemented');
};

Editor.prototype.focus = function() {
  throw new Error('not implemented');
};

Editor.prototype.blur = function() {
  throw new Error('not implemented');
};

Editor.prototype.getText = function() {
  throw new Error('not implemented');
};

Editor.prototype.getSelectionRange = function() {
  throw new Error('not implemented');
};
