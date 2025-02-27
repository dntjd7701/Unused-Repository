"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs').readFileSync('/dev/stdin').toString().trim().split(' ');

var _fs = _slicedToArray(fs, 2),
    a = _fs[0],
    b = _fs[1];

while (a % b !== 0) {
  var r = a % b; // r이 0이 아니라면, a자리에 b를 넣고, b자리에 r을 넣는다.

  if (r !== 0) {
    a = b;
    b = r;
  }
}

4;
console.log([b, fs[0] * fs[1] / b].join('\n'));