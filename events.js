// Model event classes.

var inherits = require('inherits');

function Base(isLocal) {
  this.isLocal = isLocal;
}

inherits(ReplaceText, Base);
function ReplaceText(isLocal, pos, len, value) {
  Base.call(this, isLocal);
  this.pos = pos;
  this.len = len;
  this.value = value;
}

inherits(SetSelectionRange, Base);
function SetSelectionRange(isLocal, start, end) {
  Base.call(this, isLocal);
  this.start = start;
  this.end = end;
}

module.exports = {
  ReplaceText: ReplaceText,
  SetSelectionRange: SetSelectionRange
};
