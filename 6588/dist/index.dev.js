"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// // 현재 운영체제가 Linux인지 여부 확인
// const isLinux = require('os').platform === 'linux';
// const inputs = require('fs')
//    .readFileSync(isLinux ? '/dev/stdin' : './test.txt')
//    .toString()
//    .trim()
//    .split('\n');
// const answer = [];
// // //에라토네스의 체를 활용하여 소수를 추출
// // // 6 <= n <= 100000
// function sieveOfEratosthenes(n) {
//    let primes = Array(n - 1).fill(true);
//    primes[0] = primes[1] = false;
//    for (let i = 2; i < primes.length; i++) {
//       let mutiple = 2;
//       if (primes[i]) {
//          while (mutiple * i < primes.length) {
//             primes[mutiple * i - 1] = false;
//             mutiple++;
//          }
//       }
//    }
//    // n미만의 모든 소수들의 집합
//    let arr = [];
//    primes.forEach((v, idx) => {
//       if (v && v !== 2) {
//          arr.push(idx + 1);
//       }
//    });
//    return arr;
// }
// function solution(inputs) {
//    const primes = sieveOfEratosthenes(Math.max(...inputs));
//    inputs.forEach(input => {
//       if (+input === 0) return;
//       const target = primes.find(p => primes.includes(input - p));
//       if (target === -1) {
//          answer.push("Goldbach's conjecture is wrong.");
//          return;
//       } else {
//          answer.push(`${input} = ${target} + ${input - target}`);
//       }
//    });
// }
// solution(inputs);
// console.log(answer.join('\n'));\
var fs = require('fs');

var input = fs.readFileSync('/dev/stdin').toString().trim().split('\n').map(Number);
var maxN = Math.max.apply(Math, _toConsumableArray(input));
var isPrime = Array(maxN + 1).fill(true); // 소수 여부를 저장하는 배열

function sieveOfEratosthenes() {
  isPrime[0] = isPrime[1] = false; // 0과 1은 소수가 아님

  for (var i = 2; i * i <= maxN; i++) {
    if (isPrime[i]) {
      for (var j = i * i; j <= maxN; j += i) {
        isPrime[j] = false; // i의 배수들은 소수가 아님
      }
    }
  }
}

function goldbachConjecture(n) {
  for (var i = 2; i <= n / 2; i++) {
    if (isPrime[i] && isPrime[n - i]) {
      return "".concat(n, " = ").concat(i, " + ").concat(n - i);
    }
  }

  return "Goldbach's conjecture is wrong.";
}

sieveOfEratosthenes(); // 소수 배열 미리 계산

var answers = [];

for (var i = 0; i < input.length; i++) {
  var n = input[i];
  if (n === 0) break;
  answers.push(goldbachConjecture(n));
}

console.debug(answers.join('\n'));