
#### Android와 IOS의 키보드 작동에 따른 화면 구조 

- Android OS : 키보드를 열 때, ==screen에서 키보드를 제외한 영역 만큼의 높이를 viewport로 조절합니다.==, 그렇기에 키보드를 열어도 document가 표시되는 영역이 screen에서 키보드 높이를 제외한 영역에 정상적으로 표시해줍니다. 
- IOS : 키보드를 열더라도 기존의 viewport를 조절해주지 않습니다. ==기존의 document를 키보드 높이 만큼 밀어 올립니다.==

> 키보드를 열기 전 : 화면의 높이
> 키보드를 열고난 후 : 화면의 높이 + 키보드의 높이


### 이슈 : 키보드 변경 시 입력창이 가려지는 문제 

- 방법 1 : 키보드 활성화 시 viewport의 높이를 계산하여 document의 위치를 강제이동 
- 방법 2 : 키보드 활성화 여부에 상관없이 document의 height는 동일한 점을 이용하여 document의 위치를 계산
- 방법 3 : iOS기기의 키보드의 높이가 하드코딩 방식으로 구현되어있는 점을 이용하여, visualViewport의 resize 이벤트 사용
- ...

### 해결 예제 코드 


```js
let prevVisualViewport = 0

function handleVisualViewportResize() {  
  const currentVisualViewport = window.visualViewport.height

  if (
    prevVisualViewport - 30 > currentVisualViewport &&
    prevVisualViewport - 100 < currentVisualViewport
  ) {
    const scrollHeight = window.document.scrollingElement.scrollHeight
    const scrollTop = scrollHeight - window.visualViewport.height

    window.scrollTo(0, scrollTop) // 입력창이 키보드에 가려지지 않도록 조절
  }

  prevVisualViewport = window.visualViewport.height
}

window.visualViewport.onresize = handleVisualViewportResize  
```


### 참고 

> https://channel.io/ko/blog/cross_browsing_ios15

### Conn

> [[Web(World Wide Web)]]
   [[Viewport]]

