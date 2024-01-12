
1. root부터 시작하여 자식 노드를 검색 
2. rendering 이 필요하다는(업데이트 진행) 플래그 값을 발견
3. class -> classComponentInstance.render() | function -> FunctionComponent()
4. Component의 rendering 결과물 컴파일
5. runtime 시점에 React.createElement()를 호출하여 반환 
6. createElement 는 일반적인 JS 객체를 반환하는 React Element를 리턴 


```jsx
// 일반적인 jsx문법
return <SomeComponent a={42} b="testing">Text here</SomeComponent>

// 이것을 호출해서 변환된다.
return React.createElement(SomeComponent, {a: 42, b: "testing"}, "Text Here")

// 호출결과 element를 나타내는 객체로 변환된다.
{type: SomeComponent, props: {a: 42, b: "testing"}, children: ["Text Here"]}
```



1. 위와 같은 결과물 수집 후, 새로운 Object TREE 구성 (Virtual DOM)
2. 실제 DOM과의 비교를 통해 변경 사항 수집
3. 동기화

