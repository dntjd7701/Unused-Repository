const fs = require('fs').readFileSync('./test.txt').toString().trim().split('');
console.log(fs);

const suffix = [];
while(fs.length > 0) {
    suffix.push(fs.join(''));
    fs.shift();
}

console.log(suffix.sort().join('\n'));