// Constants.

var _ = require('lodash');

exports.baseStyle = {
  boxSizing: 'border-box',
  webkitUserSelect: 'none'
};

exports.editorStyle = _.assign({}, exports.baseStyle, {
  display: 'block',
  margin: '0',
  border: '1px solid #c0c0c0',
  padding: '8px',
  width: '600px',
  height: '200px',
  background: '#fff',
  font: '400 16px/1 Arial, sans-serif',
  overflowY: 'scroll',
  outline: 'none'
});
