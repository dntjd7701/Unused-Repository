"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 두 자연수 A와 B에 대해서, A의 배수이면서 B의 배수인 자연수를 A와 B의 공배수라고 한다. 이런 공배수 중에서 가장 작은 수를 최소공배수라고 한다. 예를 들어, 6과 15의 공배수는 30, 60, 90등이 있으며, 최소 공배수는 30이다.
// 두 자연수 A와 B가 주어졌을 때, A와 B의 최소공배수를 구하는 프로그램을 작성하시오.
// 1. 시간 초과 발생. 수를 일일이 증가시켜야 하기 때문에, 다음과 같은 방식은 오랜 시간이 소요될 수 있음.
// 그러므로 유클리드 호제법을 활용한 방법을 사용하기로 결정.
// const fs = require('fs').readFileSync('./test.txt').toString().split('\n');
// fs.shift();
// const answerArr = fs.map((v) => {
//   const [num1, num2] = v.split(' ').map((v) => +v);
//   let lcm = 1;
//   while (true) {
//     if (lcm % num1 === 0 && lcm % num2 === 0) {
//       break;
//     }
//     lcm++;
//   }
//   return lcm;
// });
// console.log(answerArr.join('\n'));
var fs = require('fs').readFileSync('./test.txt').toString().split('\n');

var testCase = fs[0];

function getGCD(num1, num2) {
  while (num2 > 0) {
    var r = num1 % num2;
    num1 = num2;
    num2 = r;
  }

  return num1;
}

function getLcm(GCD, num1, num2) {
  return num1 * num2 / GCD;
}

for (var i = 0; i < testCase; i++) {
  var numbers = fs[i + 1].split(' ').map(function (v) {
    return +v;
  });
  console.log(getLcm(getGCD(Math.max(num1, num2), Math.min(num1, num2)), num1, num2));
}

fs.forEach(function (v) {
  var _v$split$map = v.split(' ').map(function (v) {
    return +v;
  }),
      _v$split$map2 = _slicedToArray(_v$split$map, 2),
      num1 = _v$split$map2[0],
      num2 = _v$split$map2[1];

  console.log(getLcm(getGCD(Math.max(num1, num2), Math.min(num1, num2)), num1, num2));
});