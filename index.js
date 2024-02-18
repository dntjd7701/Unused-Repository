const os = require('os');

// 운영체제 정보 가져오기
const platform = os.platform();

// 현재 운영체제가 Linux인지 여부 확인
const isLinux = platform === 'linux';

const fs = require('fs').readFileSync('./test.txt').toString().split('\n');

//입력의 마지막 줄에는 0이 출력된다.

console.debug('fs:', fs);
