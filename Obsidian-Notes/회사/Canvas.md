
https://m.blog.naver.com/hj_kim97/222558910338


### 커서 위치 

커서와 그림 사이의 간격이 발생하는 이유는 `offsetX`와 `offsetY` 속성이 마우스 이벤트가 발생한 요소 내에서의 상대적인 위치를 나타내기 때문입니다. 이것은 요소의 경계에서 마우스 이벤트가 발생하면 `offsetX`와 `offsetY`가 요소 내에서의 마우스 위치를 정확하게 나타내지 않을 수 있다는 것을 의미합니다.

만약에 마우스 이벤트가 요소의 경계 부근에서 발생한다면, 실제로는 커서 위치와 `offsetX`, `offsetY` 사이에 약간의 차이가 발생할 수 있습니다. 이러한 차이는 브라우저에서 마우스 이벤트를 처리하는 방식과 관련이 있습니다.

이런 경우에는 `clientX`와 `clientY` 속성을 사용하여 화면 전체를 기준으로한 마우스 위치를 얻어오고, 그 위치를 Canvas 요소의 상대적인 위치로 변환하여 사용할 수 있습니다. 이렇게 하면 브라우저의 마우스 이벤트 처리 방식에 의한 영향을 줄일 수 있습니다.

아래는 이를 구현한 코드입니다:

javascriptCopy code

`const handleMouseMove = (e) => {   const rect = canvas.getBoundingClientRect();   const x = e.clientX - rect.left;   const y = e.clientY - rect.top;    console.log('실제 커서 위치:', e.clientX, e.clientY);   console.log('Canvas 내부에서의 위치:', x, y);    // 이후 작업 수행 };`

위 코드에서는 `getBoundingClientRect()` 메서드를 사용하여 Canvas 요소의 위치와 크기를 가져온 후, 마우스 이벤트에서 `clientX`와 `clientY`를 사용하여 화면 전체를 기준으로 한 마우스 위치를 얻어오고, Canvas 요소의 위치를 기준으로 한 상대적인 위치로 변환합니다. 이렇게 하면 Canvas 내부에서의 정확한 마우스 위치를 얻을 수 있습니다.