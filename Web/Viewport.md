
### 정의

- **Viewport** : 현재 화면에서 보여지고 있는 다각형의 영역입니다. 웹 브라우저에서는 현재 창에서 문서를 볼 수 있는 부분(전체화면에서는 화면 전체)을 말합니다. viewport 바깥의 contents 영역은 스크롤 하기 전엔 보이지 않습니다.

> **visual viewport** : viewport 중에서 현재 보여지는 부분으로, layout  viewport보다 작아질 수 있습니다.
> 사용자가 줌인, 줌아웃 등의 작업을 할 때, layout viewport 영역은 그대로 남아있지만, visual viewport는 작아질 수 있습니다. 

--- 

### Visual Viewport 개념 및 사용법

- 모바일 웹에는 layout viewport와 visual viewport라는 두 개의 viewport가 존재합니다. 
- layout viewport : 페이지의 모든 요소를 다룹니다.
- visual viewport : 실제로 화면에 표시되는 부분을 다룹니다.
- 화면 키보드(OSK)와 같은 UI(User Interface) 기능은 layout viewport에 영향을 주지 않고 visual viewport의 변경을 통해 나타냅니다.
- ==window.visualViewport== 개체를 통해 visual viewport 값을 얻을 수 있습니다. (VisualViewport 개체 참고)


#### 예시 코드 

```js 
let pendingUpdate = false;

function viewportHandler(event) {
  if (pendingUpdate) return;
  pendingUpdate = true;

  requestAnimationFrame(() => {
    pendingUpdate = false;
    const layoutViewport = document.getElementById('layoutViewport');

    // Since the bar is position: fixed we need to offset it by the
    // visual viewport's offset from the layout viewport origin.
    const viewport = event.target;
    const offsetLeft = viewport.offsetLeft;
    const offsetTop = viewport.height
                - layoutViewport.getBoundingClientRect().height
                + viewport.offsetTop;

    // You could also do this by setting style.left and style.top if you
    // use width: 100% instead.
    bottomBar.style.transform = `translate(${offsetLeft}px, ${offsetTop}px) scale(${1 / viewport.scale})`;
  });
}

window.visualViewport.addEventListener('scroll', viewportHandler);
window.visualViewport.addEventListener('resize', viewportHandler)

```

### Desktop / Mobile 에서의 viewport 차이

- Desktop : Browser viewport === Desktop viewport, 사용자가 Browser 창의 크기를 조정하면서 viewport의 크기도 조절할 수 있습니다.
- Mobile : Browser 창보다 크거나 작다. 또한, 상화 좌우, 더블탭, 줌인, 줌아웃을 통해 viewport의 ==배율==을 변경할 수 있습니다.

### 키보드 오픈 시 

- 사용자가 모바일 디바이스에서 키보드를 열 때, visual viewport는 축소되지만, layout viewport는 변경되지 않습니다. 
> Android에서는 키보드가 열리면 window.visualViewport.height와 window.innerHeight가 같이 줄어들지만, iOS에서는 visualViewport값이 독립적으로 변한다.


### meta Tag의 viewport 사용 예시 

	기본적으로 데스크탑 브라우저에서는 viewport 메타 태그를 사용하지 않기 때문에 무시됩니다.

```html
<meta name="viewport" content="width=device-width, inital-scale=1.0">
```
- 아마 대부분의 프론트엔드 프레임워크(React, Vue 등)를 CRA, 혹은 vue-cli 등을 통해 설치하였다면 자동으로 위의 코드가 삽입이 되어 있습니다.

html 스니펫을 통해 입력하는 경우에도 위의 코드가 자동으로 삽입 됩니다.


### viewport 속성 

-   **width**: viewport의 가로 크기를 조정. 일반적인 숫자값이 들어 갈 수도 있고, `device-width`와 같은 특정한 값을 사용할 수도 있습니다. `device-width`는 **100% 스케일에서 CSS 픽셀들로 계산된 화면의 폭을 의미**합니다.
    
-   **height** : viewport의 세로 크기를 조정합니다.
    
-   **initial-scale** : 페이지가 처음 로딩될 때 줌 레벨을 조정. 값이 1일때는 CSS 픽셀과 기기종속적인 픽셀 간의 1:1 관계를 형성합니다.
    
-   **minimum-scale** : viewport의 최소 배율값, 기본값은 0.25.
    
-   **maximum-scale** : viewport의 최대 배율값, 기본값은 1.6.
    
-   **user-scalable** : 사용자의 확대/축소 기능을 설정, 기본값은 yes.  크롬에서 화면을 확대, 축소할 수 있는 이유입니다.


![[images_ken1204_post_ce781e46-757c-4ec7-af99-f32ef9801fd8_image.png]]

### 참고 

> https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
> https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
> https://sungchuni.tistory.com/20

---
### Related
>[[Web(World Wide Web)]]