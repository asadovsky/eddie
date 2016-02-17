// Utility functions.

exports.isAlphaNum = function(s) {
  return (/[A-Za-z0-9]/g).test(s);
};

exports.canonicalizeLineBreaks = function(s) {
  return s.replace(/(\r\n|\r|\n)/g, '\n');
};

// Binary search. Mimics Go's sort.Search.
// Returns the smallest index i in [0, n) at which f(i) is true, assuming that
// on the range [0, n), f(i) == true implies f(i+1) == true. If there is no such
// index, returns n. Calls f(i) only for i in the range [0, n).
exports.search = function(n, f) {
  var i = 0, j = n;
  while (i < j) {
    var h = i + Math.floor((j-i)/2);
    if (!f(h)) {
      i = h + 1;
    } else {
      j = h;
    }
  }
  return i;
};
