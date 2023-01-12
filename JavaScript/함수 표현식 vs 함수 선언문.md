
### 구문 

- 함수 선언문 : 주요 코드 흐름 중간에 독자적인 구문 형태로 존재합니다.
```js
function sum(a, b){
	return a+b;
}
```

- 함수 표현식 : 표현식이나 구문 구성(syntax contruct) 내부에 생성합니다.. 함수가 할당 연산자 '='' 를 이용해 만든 '할당 표현식' 우측에 생성 됩니다.

```js
let sum = function(a, b) {
	return a+b;
};
``` 

--- 

### 자바스크립트 엔진의 함수 생성 시기 

- 함수 표현식 : 실제 실행 흐름이 해당 함수에 도달했을 때 함수를 생성합니다. 따라서 실행 흐름이 함수에 도달했을 때부터 해당 함수를 사용할 수 있습니다. 

- 함수 선언문 : 함수 선언문이 정의되기 전에도 호출이 가능합니다. 

> 전역 선언문의 경우, 어디에 있느냐에  상관없이 어디에서든 사용 가능합니다. 이는  자바스크립트의 내부 알고리즘 때문인데. 스크립트 실행 전, 자바스크립트는 준비단계에서 전역에 선언된 함수 선언문을 찾고, 해당 함수를 생성합니다.  스크립트가 진짜 실행되기 전 '초기화 단계'에서 함수 선언 방식으로 정의한 함수가 생성됩니다.
  ==함수 선언문이 모두 처리된 이후에 스크립트가 실행됩니다. 따라서 어디서든 접근이  가능합니다.== 

	함수 실행 (o)
```js
sayHi('John');

function sayHi(name){
 alert(`Hello, ${name}`);
}
```

	함수 실행 (x)
```js
sayHi('John');

const sayHi = function(name){
 alert(`Hello, ${name}`);
}
```

--- 

### 스코프 

- 함수 선언문 : 블록 내 어디서든 접근 가능합니다. 하지만 블록 밖에서는 함수에 접근이 불가합니다.

	에러 예시 
```js 
let age = prompt('age', 28);

if(age < 30){
  function welcome(){
    alert('안녕');
  }
}else{
  function welcome(){
	alert('안녕하세요')
	}
}

welcome(); // Error: welcome is not defined
```

	실행 예시 
```js 
let age = 16; // 16을 저장했다 가정합시다. 

if (age < 18) { 
	welcome(); // \ (실행)_ // | 
	function welcome() { // | 
		alert("안녕!"); // | 함수 선언문은 함수가 선언된 블록 내 
	}
} // | 어디에서든 유효합니다 // | 
	welcome(); // / (실행)_ } 
else { 
	function welcome() { 
		alert("안녕하세요!");
	} 
} // 여기는 중괄호 밖이기 때문에 // 중괄호 안에서 선언한 함수 선언문은 호출할 수 없습니다. _welcome(); // Error: welcome is not defined_
```

	올바른 방식
```js
let age = prompt("나이를 알려주세요.", 18); 
let welcome; 
if (age < 18) { 
	welcome = function() { 
		alert("안녕!"); 
	}; 
} else { 
	welcome = function() { 
		alert("안녕하세요!");
	}; 
} 
welcome(); // 제대로 동작합니다._
```

	코드 정리 
```js
let age = prompt("나이를 알려주세요.", 18); 
let welcome = (age < 18) ? function() {alert('안녕!')} : function(){alert('안녕하세요!')}
welcome();
```

---

### 요약 

- 함수는 값입니다. 따라서 함수도 값처럼 할당, 복사, 선언이 가능합니다.
- '함수 선언문' 방식으로 함수를 생성하면, 함수가 독립된 구문 형태로 존재합니다. 
- '함수 표현식' 방식으로 함수를 생성하면, 함수가 표현식의 일부로 존재합니다. 
- 함수 선언문은 코드 블록이 실행되기 전에 처리됩니다.  따라서 블록 내 어디서든 사용이 가능합니다.
- 함수 표현식은 실행 흐름이 표현식에 다다랐을 때 실행됩니다.

> 함수를 선언해야 한다면 함수가 선언되기 이전에도 함수를 활용할 수 있기 때문에, 함수 선언문 방식을 따르는 게 좋습니다. 함수 선언 방식은 코드를 유연하게 구성할 수 있도록 해주고, 가독성도 좋습니다. 함수 표현식은 함수 선언문을 사용하는게 부적절할 때에 사용하는 것이 좋습니다.


----
### Ref

> https://ko.javascript.info/function-expressions