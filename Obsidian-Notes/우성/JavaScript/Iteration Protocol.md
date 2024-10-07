
----

## INDEX 

1. Iteration Protocol (이터레이션 프로토콜)
	1-1.  이터러블
	1-2. 이터레이터
	1-3. Built-in Iterable
2. 이터레이션 프로토콜의 중요성
	2-1. for...of
3. 커스텀 이터러블(Custom Iterable)
	3-1. 커스텀 이터러블 구현
	3-2. 이터러블을 생성하는 함수 
	3-3. 이터러블이면서 이터레이터인 객체를 생성하는 함수 
	3-4. 무한 이터러블과 Lazy evaluation(지연 평가)



## 1. Iteration Protocol 

> ES6에서 도입된 이터레이션 프로토콜(iteration protocol)은 Data Collection을 순회하기 위한 Protocol(미리 약속된 규칙)입니다. 

- ==이터레이션 프로토콜을 준수한 객체는 **for...of**문으로 순회할 수 있고, **Spread** 문법의 피연산자가 될 수 있습니다.==
- 이터러블 프로토콜(Iterable Protocol)과 이터레이터 프로토콜(Iterator Protocol)이 있습니다. 

![[iteration-protocol.png]]

---

### 1-1. 이터러블 

> ==Iterable Protocol을 준수한 객체==, 이터러블은 Symbol.iterator 메소드를 구현하거나 프로토타입 체인에 의해 상속한 객체를 말합니다. 

- Symbol.iterator 메소드는 이터레이터를 반환합니다. 
- 이터러블은 for...of문에서 순회할 수 있으며, Spread문법의 대상으로 사용할 수 있습니다. 

✅ 배열은 Symbol.iterator 메소드를 소유함으로, 

배열은 이터러블 프로토콜을 준수한 이터러블입니다.

```js
const arr = [1,2,3];

/* true */
console.log(Symbol.iterator in arr);

for(const item of arr){
 console.log(item);
 // 1, 2, 3
}
```

❌ 일반 객체는 Symbol.iterator 메소드를 소유하지 않습니다. 따라서 일반 객체는 이터러블 프로토콜을 준수한 이터러블이 아닙니다.

```js
const obj = {a:1, b:2};

/* false */
console.log(Symbol.iterator in obj);

// TypeError: obj is not iterable 
for (const p of obj) { 
  console.log(p); 
}
```

	하단의 커스텀 이터러블을 이용하여 이터러블 프로토콜을 준수하도록 할 수 있습니다. 

---


### 1-2. 이터레이터

> Iterator Protocol은 ==next== 메소드를 소유하며, next 메소드를 호출하면 이터러블을 순회하여 value, done 프로퍼티를 갖는 Iterator result object를 반환하는 것입니다. 
> 만약 이 규약을 준수한 객체라면 **이터레이터**라고 할 수 있습니다.

- 이터러블 프로토콜을 준수한 이터러블은 Symbol.iterator 메소드를 소유합니다.
- 이 메소드를 호출하면 이터레이터를 반환합니다.
- 이터레이터 프로토콜을 준수한 이터레이터는 ==next== 메소드를 갖습니다.

✅ next method 반환


```js
const arr = [1,2,3];
const iterator = arr[Symbol.iterator]();

/* true */
console.log('next' in iterator);
```

✅ next() 시 value, done 프로퍼티를 갖는 iterator result 객체 반환

```js
const arr = [1,2,3];
const iterator = arr[Symbol.iterator]();

/* true */
console.log('next' in iterator);

let iteratorResult = iterator.next();
/* {value:1, done: false} */
consol.elog(iteratorResult);
```

✅ next 메소드를 이용한 이터러블의 각 요소 순회. next는 포인터의 역할을 합니다. 
- value: 순회중인 각 요소
- done: 순회 완료 여부 
```js
const arr = [1,2,3];
const iterator = arr[Symbol.iterator]();

/* true */
console.log('next' in iterator);

/* {value:1, done: false} */
console.log(iterator.next());
/* {value:2, done: false} */
console.log(iterator.next());
/* {value:3, done: false} */
console.log(iterator.next());
/* {value:undefined, done: true} */
console.log(iterator.next());
```

----

### 1-3. Built-in Iterable

- Array
- String
- Map
- Set
- TypedArray(Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Araay)
- DOM data structure(NodeList, HTMLCollection)
- Arguments

✅ arguments iterable 예시 
```js
(fucntion(){
 iter = argumnets[Symbol.iterator]();
 /* {value:1, done: false} */
console.log(iter.next());
/* {value:2, done: false} */
console.log(iter.next());
/* {value:undefined, done: true} */
console.log(iter.next());

for(const args of arguments){
 console.log(arg); // 1, 2
}
})(1,2));
```

----

## 2. 이터레이션 프로토콜의 중요성

> 이터러블은 데이터 공급자로서의 역할을 합니다. 
> 만약, 이처럼 다양한 데이터 소스들이 각자의 순회 방식을 가진다면, 데이터 소비자는 다양한 데이터 소스의 순회 방식을 모두 지원해야 합니다. 하지만 이처럼 하나의 이터레이션 프로토콜을 준수하도록 규정한다면, 데이터 소비자는 이터레이션 프로토콜만을 지원하도록 구현할 수 있습니다.
> ==즉, 이터레이션 프로토콜은 다양한 데이터 소스가 하나의 순회 방식을 갖도록 규정하여 데이터 소비자가 효율적으로 다양한 데이터 소스를 사용할 수 있도록 **데이터 소비자와 데이터 소스를 연결하는 인터페이스 역할을 합니다.**==

![[iteration-protocol-interface.png]]

#### 2-1. for...of 

1. 내부적으로 이터레이터의 next 메소드 호출
2. 이터러블 순회
3. next()가 반환한 iterator result object의 value값을 변수에 할당
4. iterator result object의 done 값이 true가 될 때 순회 중단

✅ 내부 동작 예시 
```js
const iterable = [1,2,3];

const iterator = iterable[Symbol.iterator]();

for(;;){
 const res = iterator.next();
 if(res.done) break;
 console.log(res);
}
```

----

## 3. 커스텀 이터러블(Custom Iterable)

### 3-1. 커스텀 이터러블 구현 

-  일반 객체는 이터러블 프로토콜을 준수하지 않음으로 이터러블이 아닙니다. 

✅ 피보나치 수열을 구현한 이터러블 구현 

```js 
const fibonacci = {

[Symbol.iterator]() {
	let [pre, cur] = [0, 1];
	const max = 10;
	return {
		next() {
			[pre, cur] = [cur, pre + cur];
			return {
				value: cur,
				done: cur >= max,
				};

			},
	};,
};
  
/**
{value: 1, done: false}
{value: 2, done: false}
{value: 3, done: false}
{value: 5, done: false}
...
*/
let iter = fibonacci[Symbol.iterator]();
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

for (const num of fibonacci) {
	console.log(num);
}

```

✅ Iterable이 아닌 객체는 spread 문법 및 for...of의 사용이 불가하지만 위와 같이 커스텀 이터러블을 구현했을 경우 아래와 같이 사용이 가능합니다. 

```js
/* Spread */
const arr = [...fibonacci];
console.log(arr); //[1,2,3,5,8..]

/* Distructuring */
const [first, second, ...rest] = finbonacci;
console.log(first, second, rest); // 1 2 [3, 5, 8]
```

----

### 3-2. 이터러블을 생성하는 함수

 > 위 fibonacci 이터러블에는 max의 값이 고정적으로 되어 있고, 외부에서의 값을 전달할 방법이 없다는 단점이 있었습니다. 이러한 함수를 외부에서 값을 전달받을 수 있도록 수정할 수 있습니다.
 > ==(함수로 변환)==
 
```js

const fibonacciFunc = function(max) {
	let [pre, cur] = [0, 1];
	return {
		[Symbol.iterator]() {
			return {
				next() {
					[pre, cur] = [cur, pre + cur];
					return {
						value: cur,
						done: cur >= max,
						};
					},
				};
		},
	};
};

for(const num of fibonacci(20)){
	console.log(num); // 1 2 3 5 8 13
};
```

----

### 3-3. 이터러블이면서 이터레이터인 객체를 생성하는 함수

> ❗️위와 같은 경우, 이터레이터를 생성하려면 이터러블의 [Symbol.iterator] 메소드를 호출해야 한다. 
> 이터러블이면서, 이터레이터인 객체를 생성한다면, Symbol.iterator의 호출없이 이터러블 메소드와 next()등의 이터레이터로서의 작업도 가능하다. 

```js
const fibonacciFunc = function(max) {
	let [pre, cur] = [0, 1];
	return {
		/* this를 반환함으로 next 메소드를 가지는 이터레이터를 반환 */
		[Symbol.iterator]() {
			return this;
		},
		/* next()메소드의 사용 */
		next() {
			[pre, cur] = [cur, pre + cur];
			return {
				value: cur,
				done: cur >= max,
			};
		},
	};
};

const iter = fibonacciFunc(10);
console.log(iter.next());

  
for (const num of fibonacciFunc(10)) {
	console.log(num);
}
```

---
### 3-4. 무한 이터러블과 Lazy evaluation(지연 평가)

✅ 무한 수열 구현(infinite sequence)

```js
const fibonacciFunc = function () { 
	let [pre, cur] = [0, 1]; 
	return { 
		[Symbol.iterator]() { 
			return this; 
		}, 
		next() { 
			[pre, cur] = [cur, pre + cur]; 
			// done 프로퍼티를 생략한다. 
			return { value: cur }; 
		} 
	}; 
}; 
// fibonacciFunc 함수는 무한 이터러블을 생성한다. 
for (const num of fibonacciFunc()) { 
	if (num > 10000) break; 
	console.log(num); // 1 2 3 5 8... 
} 
// 무한 이터러블에서 3개만을 취득한다. 
const [f1, f2, f3] = fibonacciFunc(); 
console.log(f1, f2, f3); // 1 2 3
```

> 배열, 문자열, Map, Set 등의 빌트인 이터러블은 모두 데이터를 메모리에 확보한 다음 동작합니다. 
> 하지만, 이터러블의 경우 Lazy evaluation(지연 평가)를 통해 값을 생성합니다.
> 이는, 데이터 소비자인 for...of 문이나, Distructuring 할당이 실행되기 이전까지는 데이터를 생성하지 않는다는 의미와 같습니다. for...of문의 경우, 이터러블을 순회할 때 내부에서 이터레이터의 next 메소드를 호출하는데 바로 이때 데이터가 생성됩니다. ==즉, next() 메소드가 호출되기 이전까지는 데이터를 생성하지 않습니다. 데이터가 필요할 때까지 데이터의 생성을 지연하다가 데이터가 필요한 순간, 데이터를 생성합니다. ==
---
### Ref

> https://poiemaweb.com/es6-iteration-for-of#3-%EC%BB%A4%EC%8A%A4%ED%85%80-%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94