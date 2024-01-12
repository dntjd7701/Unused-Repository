
1. root부터 시작하여 자식 노드를 검색 
2. rendering 이 필요하다는(업데이트 진행) 플래그 값을 발견
3. class -> classComponentInstance.render() | function -> FunctionComponent()
4. Component의 rendering 결

더링이 일어나는 동안, 리액트는 컴포넌트의 루트에서 시작하여 아래쪽으로 쭉 훑어 보면서, 업데이트가 필요하다


고 플래그가 지정되어 있는 모든 컴포넌트를 찾는다. 만약 플래그가 지정되어 있는 컴포넌트를 만난다면, 클래스 컴포넌트의 경우 `classComponentInstance.render()`를, 함수형 컴포넌트의 경우 `FunctionComponent()`를 호출하고, 렌더링된 결과를 저장한다.

컴포넌트의 렌더링 결과물은 일반적으로 JSX 문법으로 구성되어 있으며, 이는 js가 컴파일되고 런타임 시점에 `React.createElement()`를 호출하여 변환된다. `createElement`는 UI 구조를 설명하는 일반적인 JS 객체인 React Element를 리턴한다. 아래 예제를 살펴보자.

```jsx
// 일반적인 jsx문법
return <SomeComponent a={42} b="testing">Text here</SomeComponent>

// 이것을 호출해서 변환된다.
return React.createElement(SomeComponent, {a: 42, b: "testing"}, "Text Here")

// 호출결과 element를 나타내는 객체로 변환된다.
{type: SomeComponent, props: {a: 42, b: "testing"}, children: ["Text Here"]}
```

전체 컴포넌트에서 이러한 렌더링 결과물을 수집하고, 리액트는 새로운 오브젝트 트리 (가상돔이라고 알려져있는)와 비교하며, 실제 DOM을 의도한 출력처럼 보이게 적용해야 하는 모든 변경 사항을 수집한다. 이렇게 비교하고 계산하는 과정을 리액트에서는 `reconciliation`이라고 한다.

그런 다음, 리액트는 계산된 모든 변경사항을 하나의 동기 시퀀스로 DOM에 적용한다.