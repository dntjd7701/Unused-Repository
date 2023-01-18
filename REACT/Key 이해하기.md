**React**에서 사용이 되는 **Key**에 대해 설명합니다.

---

## **배열 요소를 렌더링**

예제 코드 실행해보기 : [https://codepen.io/jaesung2386/pen/rNmMrOx](https://codepen.io/jaesung2386/pen/rNmMrOx)

```js
...
//예시 코드
 {this.state.header.map((value, idx) => (
                <th id={value.code}>
                  {value.name}
                </th>
              ))}   
...
```

위 코드를 실행하면, 콘솔창에서 아래 사진과 같은 경고문을 볼 수 있습니다.

-   CodePen에서는 에러 및 오류를 무시하는 경우가 있습니다. 아래 캡처 사진은 VSCode에서 실행 후 캡처한 사진입니다.

![](https://blog.kakaocdn.net/dn/LHhlC/btq9lTq8UEM/uDtVuSGAwnFFoM7vwY5REk/img.png)

**「 list 내부 각 child는 고유한 "key" prop를 가져야 한다. 」**

배열 요소를 **map()**을 사용하여 렌더링 하는 경우에는 **key**라는 **prop**가 필요합니다.

---

### **Virtual DOM이 도입된 배경**

**key**를 설명하기 앞서서 **VIrtual DOM**과 **Real DOM**에 대해 간단하게 이해를 해야합니다. 

**React**는 **Virtual DOM**을 **Memory**에 저장하고 **Real DOM**에 동기화합니다.

이 과정을 **재조정(reconiliation)**이라고 합니다.

### **React에서 Virtual DOM이 없었다면?**

React에서 Virtual DOM이 없었다면, **state** 또는 **props**가 변경되어 다시 렌더링 하여 UI를 변경하는 과정을 하나의 DOM(Real DOM)으로 처리하게 됩니다.

아무리 좋은 알고리즘이라고 해도 O(n^3)의 복잡도를 가지게 되어 좋은 성능을 내지 못합니다.

React는 아래 두 가지 가정을 기반으로 O(n) 복잡도를 가지는 **휴리스틱 알고리즘**을 구현하였습니다.

1) 서로 다른 타입의 두 엘리먼트는 서로 다른 트리를 만들어낸다.

2) 개발자가 key prop을 통해, 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다.

> **1) 서로 다른 타입의 두 엘리먼트는 서로 다른 트리를 만들어낸다.**

하나의 DOM으로 변경된 엘리먼트를 추적하는 방식은 느립니다.

느린 이유는 최상위 root부터 시작하여 변경된 엘리먼트를 추적하기 때문입니다.

React는 Virtual DOM에 변경사항이 생겨서 Real DOM에 적용을 해야하는 경우 두 개의 DOM을 비교하여 변경된 부분을 Real DOM에 적용합니다.

즉, React는 최상위 root부터 추적하는 방식이 아니라 변경된 부분만 비교를 합니다.

  

> **「 2) 개발자가 key prop을 통해, 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다. 」** 내용은 아래에서 자세하게 설명합니다.

---

**key가 왜 필요한가?**

key라는 개념이 없을 경우 React에서 엘리먼트가 변경되는 과정을 설명합니다.

**1) 맨 마지막에 엘리먼트를 추가하는 경우**

<ul>
  <li>A</li>
  <li>B</li>
</ul>

위 코드에서 맨 마지막에 <li>C</li>를 추가합니다.

<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>

![](https://blog.kakaocdn.net/dn/16XB5/btq9f6y1aP3/l6eaBmSz5UpepckwWfFGVK/img.png)

**Real DOM에 적용되는 과정**

1. Virtual DOM의 <li>A</li>와 Real DOM의 <li>A</li>를 비교합니다. 변경 사항이 없으므로 다음 Element로 넘어갑니다.

2. Virtual DOM의 <li>B</li>와 Real DOM의 <li>B</li>를 비교합니다. 변경 사항이 없으므로 다음 Element로 넘어갑니다.

3. Real DOM에는 <li>C</li>가 없으므로 Real DOM에 <li>C</li>를 추가합니다.


맨 마지막에 엘리먼트를 추가하는 경우는 문제가 없습니다.

하지만, 맨 앞에 엘리먼트를 추가하는 경우에는 큰 문제가 있습니다.

  

**2) 맨 앞에 엘리먼트를 추가하는 경우**

<ul>
  <li>A</li>
  <li>B</li>
</ul>

위 코드에서 맨 앞에 <li>C</li>를 추가합니다.

<ul>
  <li>C</li>
  <li>A</li>
  <li>B</li>
</ul>

![](https://blog.kakaocdn.net/dn/bFIqkn/btq9mm0Zhth/zgpcKEhTPsOJQRDw56bn3K/img.png)

**Real DOM에 적용되는 과정**

1. Virtual DOM의 <li>C</li>와 Real DOM의 <li>A</li>를 비교합니다. Real DOM의 <li>A</li>를 <li>C</li>로 변경합니다.

2. Virtual DOM의 <li>A</li>와 Real DOM의 <li>B</li>를 비교합니다. Real DOM의 <li>B</li>를 <li>A</li>로 변경합니다.

3. Real DOM에는 <li>B</li>가 없으므로 Real DOM에 <li>B</li>를 추가합니다.

  

즉, Real DOM의 모든 Element의 값이 변경되는 문제가 발생합니다.

  

내가 생각하는 방식은 아래 그림처럼 <li>C</li>가 맨 앞에 추가되고 기존 엘리먼트들이 이동이 될 거라고 생각했지만, 실제로는 모든 엘리먼트들이 변경되는 문제가 발생합니다.

![](https://blog.kakaocdn.net/dn/seNYg/btq9pD2sAxC/D1Ib0ikACfFUGASgDIh7ik/img.png)

---

## **Key 도입하여 위 문제를 해결**

맨 앞에 엘리먼트를 추가하는 경우를 key를 사용하여 해결합니다.

<ul>
  <li key='A'>A</li>
  <li key='B'>B</li>
</ul>

위 코드에서 맨 앞에 <li key='C'>C</li>를 추가합니다.

<ul>
  <li key='C'>C</li>
  <li key='A'>A</li>
  <li key='B'>B</li>
</ul>

  
![](https://blog.kakaocdn.net/dn/deBVV5/btq9gZfjCMV/ID6zsaDLHsijEslybYMCS1/img.png)

  

****Real DOM에 적용되는 과정****

1. key가 'C'인 li 엘리먼트가 존재하는지 확인 후 없으면, <li key='C'>C</li>를 추가합니다.

2. <li key='A'>A</li>는 변경되지 않았으므로 이동합니다.

3. <li key='B'>B</li>는 변경되지 않았으므로 이동합니다.

  

---

## **index는 key로 적절하지 않습니다.**

예제 코드 실행해보기 : [https://codepen.io/jaesung2386/pen/jOmVOrj](https://codepen.io/jaesung2386/pen/jOmVOrj)

**입력 순서**

실행 화면 → 값 입력 → 로우 추가 버튼 클릭

![](https://blog.kakaocdn.net/dn/bppWyC/btq9fclO8ED/sNOB4fVPuva8e7TfpKbxd0/img.png)

  

위 코드를 개선한 방식 : [https://codepen.io/jaesung2386/pen/oNWYgvM](https://codepen.io/jaesung2386/pen/oNWYgvM)

---

## **적절한 Key의 값은 무엇인가?**

**UUID**

-   랜덤으로 생성된 문자열

**nanoId**

-   랜덤으로 생성된 문자열(UUID보다 빠르다는 장점을 가집니다.)

---

## **Index를 Key로 사용해도 되는 경우**

아래 4가지 조건을 만족하는 경우 사용해도 괜찮습니다.

-   정적이고 변경되지 않은 경우
-   정렬을 하지 않는 경우(정렬을 하는 경우 index가 변경되기 때문에)
-   고유한 ID가 없는 경우
-   필터링 기능이 없는 경우
