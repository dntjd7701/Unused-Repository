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

const fs = require('fs').readFileSync('./test.txt').toString().split('\n');
let testCase = fs[0];

function getGCD(num1, num2) {
  while (num2 > 0) {
    const r = num1 % num2;
    num1 = num2;
    num2 = r;
  }
  return num1;
}

function getLcm(GCD, num1, num2) {
  return (num1 * num2) / GCD;
}

for (let i = 0; i < testCase; i++) {
  let numbers = fs[i + 1].split(' ').map((v) => +v);
  console.log(
    getLcm(getGCD(Math.max(num1, num2), Math.min(num1, num2)), num1, num2)
  );
}

fs.forEach((v) => {
  const [num1, num2] = v.split(' ').map((v) => +v);
  console.log(
    getLcm(getGCD(Math.max(num1, num2), Math.min(num1, num2)), num1, num2)
  );
});
