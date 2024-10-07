
공통, 화면 단위 개발을 진행하며 1인 이상의 개발자가 하나의 소스파일을 함께 수정하는 경우는 현재 빈번하게 발생한다.
여기서 문제가 발생하는데, 각자가 가지고 있는 포맷팅 방법론이 다르거나 prettier의 설정이 달라 매번 //prettier-ignore를 적용하거나 prettier를 비활성화하고 사용해야하는 불편함이 존재했다.

이러한 문제를 해소하기 위해 내부 팀 회의 때, prettier 공통 포맷팅을 정하고 공유하자는 건의를 했고 흔쾌히 허락되어 관련한 문제를 처리하기로 했다. 

크게 공통적인 포맷팅을 지정하고자 한 부분은 다음과 같다. 

1. 세미콜론
2. 띄어쓰기 
3. single quote 
4. var 금지 
5. 인자가 없는 콜백 함수는 arrow function을 사용 

참고로 이때에, ESLint는 적용하지 않기로 했다. 단계적으로 필요성을 느낄 때 추가적으로 건의할 예정이다. 



### prettier 설치 

vscode의 extesion 클릭 후 'prettier' 검색 및 설치 
![[Pasted image 20240129132813.png]]

### 자동 포맷팅 지정

vscode settings > 'format on save' 검색 
![[Pasted image 20240129132728.png]]

### 기본 포맷터 지정

vscode settings > 'default formatter' 검색 
![[Pasted image 20240129132702.png]]
다음과 같이 설정 

### 지정된 설정 파일이 존재할 경우에만 포맷팅을 진행할 수 있도록, 옵션 설정 

vscode settings > 'require config' 검색 
![[Pasted image 20240129133007.png]]

### prettier 설정 확인

프로젝트 최상단의 .prettierrc.js 확인

```js
module.exports = {

// '' or ""

singleQuote: true,

//코드 마지막에 세미콜른이 있게 formatting

semi: true,

//탭의 사용을 금하고 스페이스바 사용으로 대체하게 formatting

useTabs: false,

// 들여쓰기 너비는 2칸

tabWidth: 2,

/**

* 기본값은 버전 v2.0.0에서 none-> es5로 바뀌었다.

* es5로 설정하면 유효한 곳(객체,배열)에서의 Trailing commas는 허용하지만 다른곳에서는 허용하지 않는다. 타입스크립트의 함수 파라미터에는 허용되지 않는다.

* none으로 설정하면 trailing commas다.

* all로 설정하면 가능한 모든곳에 콤마를 찍는다. 예를들어 함수의 파라미터.

*/

trailingComma: 'all',

// '가독성을 위해 80자를 초과하는 문자를 사용하지 않는 것이 좋습니다.'라는 지침에 따라 80으로 지정. >> 코드 한줄이 maximum 80칸

printWidth: 80,

// 화살표 함수가 하나의 매개변수를 받을 때 괄호 생략

arrowParens: 'avoid',

//객체 리터럴의 대괄호 사이에 공백을 인쇄

bracketSpacing: true,

// 여러 줄의 HTML(HTML, JSX, Vue, Angular) 요소를 다음 줄에 단독으로 두는 대신 마지막 줄 끝에 넣음 (자체 닫는 요소에는 적용되지 않음).

bracketSameLine: true,

};
```
