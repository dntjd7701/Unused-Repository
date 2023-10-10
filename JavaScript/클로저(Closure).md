
--- 
### 참조 
[poiemaweb](https://poiemaweb.com/js-closure)

--- 
### 서론 

자바스크립트를 사용하는 개발자로서 클로저란 개념에 대해서는 많이 접하고 들어왔다. 하지만 정확히 어떤 개념인지, 또 어떻게 사용되어지는 지에 대한 이해가 부족하다 느껴 정리하게 되었다. 
관련 글을 읽고 핵심만 따로 정리하였다. 

--- 
### 왜 클로저인가 ?

클로저에 의해 참조되는 외부함수의 변수를 **자유변수(Free variable)**라고 부른다. 클로저라는 이름은 자유변수에 함수가 닫혀있다(closed)라는 의미로 의역하면 자유변수에 엮여있는 함수라는 뜻이다.

---
### 클로저의 정의 

```js
function outerFunc() { 
   var x = 10; 
   var innerFunc = function () { 
        console.log(x); 
    }; 
 return innerFunc; 
} 


/** * 함수 outerFunc를 호출하면 내부 함수 innerFunc가 반환된다. * 그리고 함수 outerFunc의 실행 컨텍스트는 소멸한다. */ 
var inner = outerFunc(); 
inner(); // 10
```
위의 코드와 같이 이미 outerFunc의 함수는 실행이 종료되었다. 그럼에도 outerFunc내의 innerFunc는 outerFunc의 변수 x에 접근이 가능하다. !! 이미 생을 마감한 함수의 변수에 접근이 가능한 것이다 !!!

이는 결국, 렉시컬 스코프를 기억하고 있는 실행 컨텍스트의 스코프 체인을 자바스크립트 엔진이 검색하였기에 가능한 일이다. 

> 즉, 클로저란 자신을 포함하고 있는 외부함수보다 내부함수가 더 오래 유지되는 경우, **외부 함수 밖에서 내부함수가 호출되더라도 외부함수의 지역 변수에 접근할 수 있는데** 이러한 함수를 클로저(Closure)라고 부른다.
> 
> **이는 반환된 내부함수가 자신이 선언됐을 때의 환경(Lexical environment)인 스코프를 기억하여 자신이 선언됐을 때의 환경(스코프) 밖에서 호출되어도 그 환경(스코프)에 접근할 수 있는 함수를 뜻한다.**

---
### 원리 

[실행 컨텍스트](https://poiemaweb.com/js-execution-context)의 관점에 설명하면, 내부함수가 유효한 상태에서 외부함수가 종료하여 외부함수의 실행 컨텍스트가 반환되어도, 외부함수 실행 컨텍스트 내의 **활성 객체(Activation object)**(변수, 함수 선언 등의 정보를 가지고 있다)는 **내부함수에 의해 참조되는 한 유효**하여 내부함수가 **스코프 체인**을 통해 참조할 수 있는 것을 의미한다.

즉 외부함수가 이미 반환되었어도 외부함수 내의 변수는 이를 필요로 하는 내부함수가 하나 이상 존재하는 경우 계속 유지된다. 이때 내부함수가 외부함수에 있는 변수의 복사본이 아니라 실제 변수에 접근한다는 것에 주의하여야 한다.

---
### *****활용 

> 1. 상태 유지 
> 2. 전역 변수의 사용 억제 
> 3. 정보 은닉 


#### 1. 상태유지 

```html 
<!DOCTYPE html> 
<html>
 <body> 
 <button class="toggle">toggle</button> 
 <div class="box" style="width: 100px;    height: 100px; background: red;">
 </div> 
 <script> 
var box = document.querySelector('.box'); 
var toggleBtn = document.querySelector('.toggle'); 
var toggle = (function () { 
   var isShow = false; // ① 클로저를 반환 
   return function () { 
      box.style.display = isShow ? 'block' : 'none'; 
      // ③ 상태 변경 
      isShow = !isShow; }; })(); 
      // ② 이벤트 프로퍼티에 클로저를 할당
      toggleBtn.onclick = toggle; 
 </script> 
 </body> 
</html>
```


#### 2. 전역 변수의 사용 억제 

```html
<!DOCTYPE html> 
<html> 
 <body> 
 <p>클로저를 사용한 Counting</p> 
 <button id="inclease">+</button> 
 <p id="count">0</p> 
 <script> 
 var incleaseBtn = document.getElementById('inclease'); 
 var count = document.getElementById('count');  var increase = (function () { 
 // 카운트 상태를 유지하기 위한 자유 변수 
 var counter = 0; 
 // 클로저를 반환 
 return function () { return ++counter; }; 
 }()); 
 incleaseBtn.onclick = function () {   
 count.innerHTML = increase(); 
 }; 
 </script> 
 </body> 
</html>
```

변수의 값은 누군가에 의해 언제든지 변경될 수 있어 오류 발생의 근본적 원인이 될 수 있다. 상태 변경이나 가변(mutable) 데이터를 피하고 **불변성(Immutability)을 지향**하는 함수형 프로그래밍에서 **부수 효과(Side effect)를 최대한 억제**하여 오류를 피하고 프로그램의 안정성을 높이기 위해 클로저는 적극적으로 사용된다.

- 함수형 프로그래밍 예시 

```js 
// 함수를 인자로 전달받고 함수를 반환하는 고차 함수 
// 이 함수가 반환하는 함수는 클로저로서 카운트 상태를 유지하기 위한 자유 변수 counter을 기억한다. 
function makeCounter(predicate) { 
 // 카운트 상태를 유지하기 위한 자유 변수 
 var counter = 0; 
 // 클로저를 반환 
 return function () { 
 counter = predicate(counter); 
 return counter; 
 }; 
} 
// 보조 함수 
function increase(n) { return ++n; } 
// 보조 함수 
function decrease(n) { return --n; } 
// 함수로 함수를 생성한다. 
// makeCounter 함수는 보조 함수를 인자로 전달받아 함수를 반환한다 
const increaser = makeCounter(increase); console.log(increaser()); // 1 console.log(increaser()); // 2 
// increaser 함수와는 별개의 독립된 렉시컬 환경을 갖기 때문에 카운터 상태가 연동하지 않는다. 
const decreaser = makeCounter(decrease); console.log(decreaser()); // -1 
console.log(decreaser()); // -2

```


#### 3. 정보 은닉 

```js 
//생성자 함수 
function Counter() { 
 // 카운트를 유지하기 위한 자유 변수 
 var counter = 0; 
 // 클로저 
 this.increase = function () { return 
 ++counter; }; 
 // 클로저 
 this.decrease = function () { return -- 
 counter; }; 
} 
 
const counter = new Counter(); console.log(counter.increase()); // 1 
console.log(counter.decrease()); // 0
```

생성자 함수 Counter는 increase, decrease 메소드를 갖는 인스턴스를 생성한다. 이 메소드들은 모두 자신이 생성됐을 때의 렉시컬 환경인 생성자 함수 Counter의 스코프에 속한 변수 counter를 기억하는 클로저이며 렉시컬 환경을 공유한다. 생성자 함수가 함수가 생성한 객체의 메소드는 객체의 프로퍼티에만 접근할 수 있는 것이 아니며 자신이 기억하는 렉시컬 환경의 변수에도 접근할 수 있다.

이때 생성자 함수 Counter의 변수 counter는 this에 바인딩된 프로퍼티가 아니라 변수다. counter가 this에 바인딩된 프로퍼티라면 생성자 함수 Counter가 생성한 인스턴스를 통해 외부에서 접근이 가능한 `public` 프로퍼티가 되지만 생성자 함수 Counter 내에서 선언된 변수 counter는 생성자 함수 Counter 외부에서 접근할 수 없다. 하지만 생성자 함수 Counter가 생성한 인스턴스의 메소드인 increase, decrease는 클로저이기 때문에 자신이 생성됐을 때의 렉시컬 환경인 생성자 함수 Counter의 변수 counter에 접근할 수 있다. 이러한 클로저의 특징을 사용해 클래스 기반 언어의 `private` 키워드를 흉내낼 수 있다.