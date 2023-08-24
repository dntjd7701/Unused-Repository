## Ref

> https://web.dev/i18n/ko/code-splitting-suspense/

--- 


![](https://web-dev.imgix.net/image/admin/Lk8KvDZcWntc7rtQzvv9.jpg?auto=format)

이 페이지에서

-   [이것이 왜 유용한가요?](https://web.dev/i18n/ko/code-splitting-suspense/#%EC%9D%B4%EA%B2%83%EC%9D%B4-%EC%99%9C-%EC%9C%A0%EC%9A%A9%ED%95%9C%EA%B0%80%EC%9A%94)
-   [Suspense](https://web.dev/i18n/ko/code-splitting-suspense/#suspense)
-   [여러 구성 요소 일시 중단](https://web.dev/i18n/ko/code-splitting-suspense/#%EC%97%AC%EB%9F%AC-%EA%B5%AC%EC%84%B1-%EC%9A%94%EC%86%8C-%EC%9D%BC%EC%8B%9C-%EC%A4%91%EB%8B%A8)
-   [로딩 실패 처리](https://web.dev/i18n/ko/code-splitting-suspense/#%EB%A1%9C%EB%94%A9-%EC%8B%A4%ED%8C%A8-%EC%B2%98%EB%A6%AC)
-   [결론](https://web.dev/i18n/ko/code-splitting-suspense/#%EA%B2%B0%EB%A1%A0)

# React.lazy 및 Suspense를 사용한 코드 분할

코드 분할의 기본 개념을 아직 이해하지 못한다면 [먼저 코드 분할로 자바스크립트 페이로드 줄이기](https://web.dev/reduce-javascript-payloads-with-code-splitting) 가이드를 참조하세요.

**`React.lazy`** 메서드를 사용하면 동적 가져오기를 사용하여 구성 요소 수준에서 React 애플리케이션을 쉽게 코드 분할할 수 있습니다.

```jsx
import React, { lazy } from 'react';const AvatarComponent = lazy(() => import('./AvatarComponent'));const DetailsComponent = () => (  <div>    <AvatarComponent />  </div>)
```

## 이것이 왜 유용한가요? [#](https://web.dev/i18n/ko/code-splitting-suspense/#%EC%9D%B4%EA%B2%83%EC%9D%B4-%EC%99%9C-%EC%9C%A0%EC%9A%A9%ED%95%9C%EA%B0%80%EC%9A%94)

큰 React 애플리케이션은 일반적으로 많은 구성 요소, 유틸리티 메서드 및 타사 라이브러리로 구성됩니다. 필요할 때만 애플리케이션의 다른 부분을 로드하려고 노력하지 않으면 사용자가 첫 페이지를 로드하는 즉시 대규모 단일 JavaScript 번들이 사용자에게 전송됩니다. 이는 페이지 성능에 상당한 영향을 줄 수 있습니다.

`React.lazy` 함수는 응용 프로그램의 구성 요소를 손쉽게 개별 JavaScript 청크로 분리하는 기본 제공 방법을 제공합니다. `Suspense` 구성 요소와 결합할 때 로드 상태를 처리할 수 있습니다.

## Suspense [#](https://web.dev/i18n/ko/code-splitting-suspense/#suspense)

사용자에게 큰 JavaScript 페이로드를 전송할 때의 문제는 특히 저사양 장치와 저속 네트워크 연결에서 페이지 로드를 완료하는 데 걸리는 시간입니다. 이것이 코드 분할 및 지연 로딩이 매우 유용한 이유입니다.

그러나 네트워크를 통해 코드 분할 구성 요소를 가져올 때 사용자가 경험해야 하는 약간의 지연이 항상 있으므로 유용한 로드 상태를 표시하는 것이 중요합니다. **`Suspense`** 구성 요소와 함께 `React.lazy`를 사용하면 이 문제를 해결하는 데 도움이 됩니다.

```jsx
import React, { lazy, Suspense } from 'react';const AvatarComponent = lazy(() => import('./AvatarComponent'));const renderLoader = () => <p>Loading</p>;const DetailsComponent = () => (  <Suspense fallback={renderLoader()}>    <AvatarComponent />  </Suspense>)
```

`Suspense` 는 모든 React 구성 요소를 로드 상태로 표시할 수 `fallback` 다음 예는 이것이 어떻게 작동하는지 보여줍니다. 아바타는 버튼을 클릭할 때만 렌더링되며 일시 중단된 `AvatarComponent` 필요한 코드를 검색하라는 요청이 생성됩니다. 그 동안 폴백 로드 구성 요소가 표시됩니다.

`AvatarComponent` 를 구성하는 코드가 작기 때문에 로딩 스피너가 짧은 시간 동안만 표시됩니다. 더 큰 구성 요소는 특히 약한 네트워크 연결에서 로드하는 데 훨씬 더 오래 걸릴 수 있습니다.

이것이 어떻게 작동하는지 더 잘 보여주는 예시:

-   To preview the site, press **View App**. Then press **Fullscreen** ![fullscreen](https://web.dev/images/glitch/fullscreen.svg). - Press `Control+Shift+J` (or `Command+Option+J` on Mac) to open DevTools.
    
-   Click the **Network** tab.
    
-   기본적 으로 **No throttling**으로 설정되어 있는 **Throttling** 드롭다운을 클릭합니다. **고속 3G**를 선택합니다.
    
-   앱에서 **Click Me** 버튼을 클릭합니다.
    

이제 로딩 표시기가 더 오래 표시됩니다. `AvatarComponent`를 구성하는 모든 코드를 별도의 청크로 가져오는 방법에 주목하십시오.

![다운로드 중인 하나의 chunk.js 파일을 보여주는 DevTools 네트워크 패널](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ga9IsnuJoJdnUfE6sGee.png?auto=format)

React는 현재 구성 요소가 서버 측에서 렌더링될 때 Suspense를 지원하지 않습니다. 서버에서 렌더링하는 경우 React 문서에서 권장하는 [`loadable-components`](https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/)와 같은 다른 라이브러리를 사용하는 것이 좋습니다.

## 여러 구성 요소 일시 중단 [#](https://web.dev/i18n/ko/code-splitting-suspense/#%EC%97%AC%EB%9F%AC-%EA%B5%AC%EC%84%B1-%EC%9A%94%EC%86%8C-%EC%9D%BC%EC%8B%9C-%EC%A4%91%EB%8B%A8)

`Suspense`의 또 다른 기능은 **여러 구성 요소가 모두 지연 로드된 경우에도** 로드에서 여러 구성 요소를 일시 중단할 수 있다는 것입니다.

예시:

```jsx
import React, { lazy, Suspense } from 'react';const AvatarComponent = lazy(() => import('./AvatarComponent'));const InfoComponent = lazy(() => import('./InfoComponent'));const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));const renderLoader = () => <p>Loading</p>;const DetailsComponent = () => (  <Suspense fallback={renderLoader()}>    <AvatarComponent />    <InfoComponent />    <MoreInfoComponent />  </Suspense>)
```

이것은 단일 로드 상태만 표시하면서 여러 구성 요소의 렌더링을 지연시키는 매우 유용한 방법입니다. 모든 구성 요소 가져오기가 완료되면 사용자는 동시에 표시되는 모든 구성 요소를 보게 됩니다.

다음 삽입을 통해 이를 확인할 수 있습니다.

로딩 표시기가 너무 빨리 표시됩니까? DevTools에서 조절된 연결을 다시 시뮬레이션해 보십시오.

이것이 없으면 각각 고유한 로딩 표시기가 있는 UI의 다른 부분이 차례로 로딩되는 문제인 _엇갈린 로딩_이 발생하기 쉽습니다. 이로 인해 사용자 경험이 더 거슬리게 느껴질 수 있습니다.

Suspense를 사용하여 구성요소를 분할하는 것이 이미 가능하고 번들 크기를 쉽게 줄일 수 있지만 React 팀은 이를 더욱 확장할 수 있는 더 많은 기능을 계속 작업하고 있습니다. [React 16.x 로드맵](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html)에서 이에 대해 자세히 설명합니다.

## 로딩 실패 처리 [#](https://web.dev/i18n/ko/code-splitting-suspense/#%EB%A1%9C%EB%94%A9-%EC%8B%A4%ED%8C%A8-%EC%B2%98%EB%A6%AC)

`Suspense` 사용하면 네트워크 요청이 내부적으로 이루어지는 동안 임시 로드 상태를 표시할 수 있습니다. 그러나 이러한 네트워크 요청이 어떤 이유로 실패하면 어떻게 될까요? 오프라인 상태이거나 웹 앱이 오래되어 서버 재배포 후 더 이상 사용할 수 없는 [버전이 지정된](https://web.dev/http-cache/#long-lived-caching-for-versioned-urls) URL을 지연 로드하려고 할 수 있습니다.

React에는 오류 경계를 사용하여 이러한 유형의 로드 실패를 정상적으로 처리하기 위한 표준 패턴이 있습니다. [문서에](https://reactjs.org/docs/error-boundaries.html) 설명되어 있듯이 `static getDerivedStateFromError()` 또는 `componentDidCatch()` 중 하나(또는 둘 다)를 구현하는 경우 오류 경계 역할을 할 수 있습니다.

지연 로딩 오류를 감지하고 처리하기 위해 `Suspense` 구성 요소를 오류 경계 역할을 하는 상위 구성 요소로 래핑할 수 있습니다. 오류 경계의 `render()` 메서드 내에서 오류가 없으면 자식을 있는 그대로 렌더링하거나 문제가 발생하면 사용자 지정 오류 메시지를 렌더링할 수 있습니다.

```js
import React, { lazy, Suspense } from 'react';const AvatarComponent = lazy(() => import('./AvatarComponent'));const InfoComponent = lazy(() => import('./InfoComponent'));const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));const renderLoader = () => <p>Loading</p>;class ErrorBoundary extends React.Component {  constructor(props) {    super(props);    this.state = {hasError: false};  }  static getDerivedStateFromError(error) {    return {hasError: true};  }  render() {    if (this.state.hasError) {      return <p>Loading failed! Please reload.</p>;    }    return this.props.children;  }}const DetailsComponent = () => (  <ErrorBoundary>    <Suspense fallback={renderLoader()}>      <AvatarComponent />      <InfoComponent />      <MoreInfoComponent />    </Suspense>  </ErrorBoundary>)
```

## 결론 [#](https://web.dev/i18n/ko/code-splitting-suspense/#%EA%B2%B0%EB%A1%A0)

React 애플리케이션에 코드 분할을 적용할 위치가 확실하지 않은 경우 다음 단계를 따르세요.

1.  경로 수준에서 시작합니다. 경로는 분할할 수 있는 애플리케이션의 지점을 식별하는 가장 간단한 방법입니다. [React 문서](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting)에 `Suspense`를 [`react-router`](https://github.com/ReactTraining/react-router)와 함께 사용하는 방법이 설명되어 있습니다.
2.  특정 사용자 상호작용(예: 버튼 클릭)에서만 렌더링되는 사이트 페이지의 큰 구성요소를 식별합니다. 이러한 구성 요소를 분할하면 JavaScript 페이로드가 최소화됩니다.
3.  화면 밖에 있고 사용자에게 중요하지 않은 것은 모두 분할하는 것을 고려하십시오.