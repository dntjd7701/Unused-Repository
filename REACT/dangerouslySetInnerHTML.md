-  **dangerouslySetInnerHTML** :  브라우저 DOM에서 innerHTML을 사용하기 위한 React의 대체 방법입니다.

일반적으로 코드에서 HTML을 설정하는 것은 사이트 간 스크립팅 공격에 쉽게 노출될 수 있기 때문에 위험합니다. 따라서 React에서 직접 HTML을 설정할 수는 있지만, 위험하다는 것을 상기시키기 위해 **dangerouslySetInnerHTML을 작성하고 __html 키로 객체를 전달**해야 합니다.

### 특징

1. dangerouslySetInnerHTML를 사용하면 React는 특정 요소의 내용이 동적임을 알고 해당 노드의 자식에 대해 약간의 추가적인 성능을 얻기 위해 가상 DOM과의 비교를 간단하게 스킵합니다. 
2. innerHTML과 마찬가지로 XSS(교차 사이트 스크립팅) 공격에 취약하게 만들기 때문에 사용하는 것이 위험할 수 있습니다. 특히 타사 소스에서 데이터를 가져오거나 사용자가 제출한 콘텐츠를 렌더링하는 경우 문제가 됩니다.
3. tag로 둘러싸인 string의 innerHTML과의 동작 차이
> [1] innerHTML
```js
const App = () => {
  const data = 'lorem <b>ipsum</b>';

  return (
    <div>
      {data}
    </div>
  );
}

export default App;

```
> 이 경우, data의 string 그대로 나오게 됩니다. (bold X)


> [2] dangerouslySetInnerHTML

```js
const App = () => {
  const data = 'lorem <b>ipsum</b>';

  return (
    <div
      dangerouslySetInnerHTML={{__html: data}}
    />
  );
}

export default App;
```
>  이 경우, bold 처리된 문자열이 나오게 됩니다.
>  !주의) `dangerouslySetInnerHTML`속성을 사용하는 요소에 자식이 없어야 하므로 `<div>`요소를 자동 닫는 태그로 사용해야 합니다.

---
### 결론

> 결론적으로, `dangerouslySetInnerHTML`는 React에서 를 대체하는 것일 뿐 `innerHTML` 이므로 주의해서 사용해야 합니다. 이름은 사용상의 위험을 암시하지만 잘 개발된 sanitizer를 사용하여 필요한 조치를 취하면 코드가 깨끗하고 React 노드 내에서 렌더링될 때 예기치 않은 스크립트를 실행하지 않습니다.
