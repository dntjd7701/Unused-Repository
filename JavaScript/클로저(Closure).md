
--- 
### 참조 
[poiemaweb](https://poiemaweb.com/js-closure)
[[스코프(Scope)]]

--- 
### 서론 

자바스크립트를 사용하는 개발자로서 클로저란 개념에 대해서는 많이 접하고 들어왔다. 하지만 정확히 어떤 개념인지, 또 어떻게 사용되어지는 지에 대한 이해가 부족하다 느껴 정리하게 되었다. 

위 글에서 클로저의 핵심 부분만 따로 정리한다. 

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
자신을 포함하고 있는 외부함수보다 내부함수가 더 오래 유지되는 경우, **외부 함수 밖에서 내부함수가 호출되더라도 외부함수의 지역 변수에 접근할 수 있는데** 이러한 함수를 클로저(Closure)라고 부른다.

> **클로저는 반환된 내부함수가 자신이 선언됐을 때의 환경(Lexical environment)인 스코프를 기억하여 자신이 선언됐을 때의 환경(스코프) 밖에서 호출되어도 그 환경(스코프)에 접근할 수 있는 함수**

