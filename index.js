// 1929 소수구하기(실버)

// M 이상 N이하의 소수를 모두 출력하는 프로그램을 작성하시오.

//첫째 줄에 자연수 M과 N이 빈 칸을 사이에 두고 주어진다.
//(1 ≤ M ≤ N ≤ 1,000,000) M이상 N이하의 소수가 하나 이상 있는 입력만 주어진다.

const os = require('os');

// 운영체제 정보 가져오기
const platform = os.platform();

// 현재 운영체제가 Linux인지 여부 확인
const isLinux = platform === 'linux';

const fs = require('fs')
   .readFileSync(isLinux ? '/dev/stdin' : './test.txt')
   .toString()
   .split(' ')
   .map(v => +v);

const answers = [];
for (let i = fs[0]; i <= fs[1]; i++) {
   // 소수는 1과 자기 자신으로만 나누어짐으로, 나눌때마다 카운터를 증가시키고, 그 수가 1일 경우에만 소수로 인정
   let primeCheck = 0;
   for (let j = 2; j <= i; j++) {
      if (i % j === 0) primeCheck++;
   }

   if (primeCheck === 1) {
      answers.push(i);
   }
}

console.debug(answers.join('\n'));
