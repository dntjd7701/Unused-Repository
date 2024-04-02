
  

|   |
|---|
|### 자바스크립트에서 async / await을 사용하면 좀 더 깔끔한 코드를 작성할 수 있지만, <br><br>### 아래와 같은 여러개의 await을 사용시 주의해야합니다.<br><br>  <br><br>![](http://wiki.duzon.com:8080/download/attachments/141632818/await1.png?version=2&modificationDate=1649911868392&api=v2 "[ERP개발본부] ERP개발2센터 > async, await 병목현상 처리 (feat. Promise.all()/allSettled()) > await1.png")<br><br>위 API 들의 통신 시간은 총 **3,200ms** 가 소요됩니다. 따라서,<br><br>로딩바가 존재하지 않는다면 사용자가 해당 3초가량의 시간동안 페이지의 초기설정전의 화면에 동작을 수행할 수 있습니다.|

  

|   |
|---|
|위의 방식은 개선할 여지가 보입니다.<br><br>![](http://wiki.duzon.com:8080/download/attachments/141632818/await2.png?version=1&modificationDate=1649912930310&api=v2 "[ERP개발본부] ERP개발2센터 > async, await 병목현상 처리 (feat. Promise.all()/allSettled()) > await2.png")<br><br>첫번째 개별 await 방식처리 보다 3200 → 1200 으로 2초(2000ms) 가량의 성능 향상을 기대할 수 있습니다.|

  

|   |
|---|
|위의 경우와는 다른 경우가 있습니다.<br><br>\|   \|   \|   \|<br>\|---\|---\|---\|<br>\|개선 전<br><br>![](http://wiki.duzon.com:8080/download/attachments/141632818/await3.png?version=2&modificationDate=1649913734003&api=v2 "[ERP개발본부] ERP개발2센터 > async, await 병목현상 처리 (feat. Promise.all()/allSettled()) > await3.png")\|개선 후<br><br>![](http://wiki.duzon.com:8080/download/attachments/141632818/await4.png?version=1&modificationDate=1649913626839&api=v2 "[ERP개발본부] ERP개발2센터 > async, await 병목현상 처리 (feat. Promise.all()/allSettled()) > await4.png")\|<br>\|개선 전과 비교하여 1600ms → 1500ms 의 100ms 가량의 성능 개선이 가능합니다.\|   \|   \|<br><br>위의 방식이 무조건 좋은 방식이라고는 할 수 없습니다. 코드의 가독성 측면에서는 썩 좋지만은 않습니다.<br><br>하지만 병목현상이 심하다고 판단 할 경우 위의 개선방식으로도 시도해봐도 좋은 방식인건 틀림없는것 같습니다.|

  

|   |
|---|
|Promise.all() / Promise.allSettled()<br><br>\|   \|   \|   \|<br>\|---\|---\|---\|<br>\|Promise.all()<br><br>![](http://wiki.duzon.com:8080/download/attachments/141632818/image2022-6-6_16-49-1.png?version=1&modificationDate=1654501741034&api=v2 "[ERP개발본부] ERP개발2센터 > async, await 병목현상 처리 (feat. Promise.all()/allSettled()) > image2022-6-6_16-49-1.png")\|Promise.allSettled()<br><br>![](http://wiki.duzon.com:8080/download/attachments/141632818/image2022-6-6_16-48-3.png?version=1&modificationDate=1654501683008&api=v2 "[ERP개발본부] ERP개발2센터 > async, await 병목현상 처리 (feat. Promise.all()/allSettled()) > image2022-6-6_16-48-3.png")\|<br>\|차이점 :<br><br>- Promise.all() 주어진 Promise 중 하나라도 거부되는 경우, 첫 번째로 reject를 반환한 Promise의 내용을 반환합니다.<br>- Promise.allSettled()는 각각의 결과값을 따로 반환합니다.\|   \|   \|<br><br>각각의 Promise 처리 결과를 알고, 그에 따른 개별적인 처리가 필요하다면 allSettled()를 사용하는 것이 더욱 적합할 수 있습니다.|