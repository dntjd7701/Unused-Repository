에라토스테네스의 체(Sieve of Eratosthenes)는 주어진 범위 내에서 모든 소수를 찾아내는 효율적인 알고리즘입니다. 이 알고리즘은 고대 그리스의 수학자 에라토스테네스에 의해 고안되었습니다.

알고리즘의 동작 과정은 다음과 같습니다:

초기화: 2부터 N까지의 모든 수를 후보로 놓습니다.
반복: 2부터 시작하여 각 수의 배수들을 지워나갑니다. 즉, 2의 배수를 모두 지우고, 다음으로 남아있는 수(소수)인 3의 배수를 지우고, 5의 배수, 7의 배수, ...를 계속해서 지워나갑니다.
소수 찾기: 이 과정을 반복하여 남아 있는 모든 수는 소수가 됩니다.
에라토스테네스의 체는 다음과 같은 특징을 가지고 있습니다:

간단하면서도 효율적인 방법으로 소수를 찾을 수 있습니다.
모든 소수를 찾는 데에는 O(N log log N)의 시간 복잡도를 가집니다.
반복 범위 내에서 소수를 찾을 때 유용합니다.
아래는 에라토스테네스의 체를 구현한 간단한 예제 코드입니다:

```js
function sieveOfEratosthenes(N) {
   let isPrime = Array(N + 1).fill(true);
   isPrime[0] = isPrime[1] = false;

   for (let i = 2; i * i <= N; i++) {
      if (isPrime[i]) {
         for (let j = i * i; j <= N; j += i) {
            isPrime[j] = false;
         }
      }
   }

   const primes = [];
   for (let i = 2; i <= N; i++) {
      if (isPrime[i]) {
         primes.push(i);
      }
   }

   return primes;
}

// 예시: 1부터 30까지의 소수를 구하기
const primesUpTo30 = sieveOfEratosthenes(30);
console.log(primesUpTo30); // 출력: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```
