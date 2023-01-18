
> 번역 https://nextjs.org/learn/foundations/about-nextjs
> 본 글은 Next on Vercel의 글을 번역 및 해석 정리한 글입니다. 


### Introduction

효과적으로 Next.js를 사용하기 위해, JavaScript, React, 그리고 연관된 웹 개발 컨셉들을 이해하는 것은 많은 도움이 됩니다. 하지만 JavaScript와 React는 매우 광범위한 주제입니다. 그렇다면 ! Next.js를 배우기 위해 어떤 준비를 해야할까요 ?

본 글을 통해 간단한 프로젝트를 차근차근 시작해볼 수 있습니다. JavaScript application으로 시작해서, React, NextJs로 옮겨갑니다. 

> 본 글에서는 HTML, CSS, JavaScript의 기본 지식을 가지고 있다고 가정합니다. 만약 React에 친숙하신 분이라면 'Getting Started with Next.js', 'Creat your first Next.js app'은 생략하실 수 있습니다.

### What is Next.js?

Next.js는 빠른 웹 어플리케이션을 개발하기 위한 빌딩 블록을 제공하는 유연한 React framework입니다. 

하지만 정확이 이게 무엇을 의미하는 걸까요 ?

React와 Next.js가 어떻게 도움을 줄 수 있는지 알아봅시다.

#### Building Blocks of a Web Application

우리는 현대적인 어플리케이션을 만들기 위해 고려해야할 몇 가지 사항이 있습니다.

- UI(User Interface) - 어떻게 유저가 사용하고 어플리케이션과 상호작용할지 
- Routing - 어떻게 유저가 어플리케이션의 다른 두 화면을 탐색할지 
- Data Fetching - 데이터가 저장된 위치와, 어떻게 그 데이터를 가져올지 
- Rendering - 언제 그리고 어디에 static 또는 dynamic한 콘텐츠를 rendering할지 
 	**Rendering**
	-   **SSR:** Server-Side Rendering - rendering a client-side or universal app to HTML on the server.
	-   **CSR:** Client-Side Rendering - rendering an app in a browser, generally using the DOM.
	-   **Rehydration:** “booting up” JavaScript views on the client such that they reuse the server-rendered HTML’s DOM tree and data.
	-   **Prerendering:** running a client-side application at build time to capture its initial state as static HTML.
	
- Integrations(통합) - 어떤 써드파티 서비스를 사용할지(CMS, auth, payments, etc..) 그리고 어떻게 연결할지
- Infrastructure - 어플리케이션 코드를 어디에 배포하고 저장하고 실행할지(Serverless, CDN, Edge, etc)
- Performance(수행능력) - 최종 사용자를 위해 어플리케이션을 어떻게 최적화할지
- Scalability(확장성) - 팀, 데이터 및 트래픽이 증가함에 따라 어플리케이션이 어떻게 적응하는지  
- Developer Experience - 개발자가 어플리케이션 구축함과 유지에 있어 좋은 경험을 제공받는지 

위와 같은 사항들을 만족하기 위해 개발자는 스스로 방법을 찾던지 다른 도구와 프레임워크를 사용할지 결정해야합니다. 

#### What is React

React는 JavasScript 라이브러리로, 상호작용 가능한 User Interface를 구축하기 위해 사용합니다. 

 > User Interface는 화면에서 사용자가 볼 수 있고 상호작용이 가능한 요소들을 의미합니다.

![[Pasted image 20230105170045.png]]

라이브러리로써 React는 UI를 구축하는데 유용한 함수를 제공합니다. 하지만 어디에 이러한 함수를 사용할지는 개발자에게 맡겨집니다.

React가 성공한 한 이유로써 React는 구축에 있어 자유도가 높습니다. 강한 의견을 내지 않고  비교적 자유롭습니다. 이러한 특징의 결과로 다른 서드파티와 많은 솔루션들이 탄생하였습니다. 

하지만 이러한 의미는 결과적으로 React로 어플리케이션을 구축하기 위해선 노력이 필요합니다. 개발자는 다른 도구들을 이해하고 해결법을 찾아내기 위해 노력해야합니다.

#### What is Next.js?

Next.js는 빠른 웹 어플리케이션을 개발하기 위한 빌딩 블록을 제공하는 유연한 React framework입니다. 

프레임워크로서 Next.js는 React에 필요한 도구 및 구성을 처리하고 추가 구조, 기능, 최적화 기능을 제공합니다. 

![[next-app.png]]

당신은 React를 사용해 UI를 구축하고, 점진적으로 Next.js를 적용해나갈 수 있습니다. 최종 사용자 경험과 개발자 경험을 향상시키기면서  일반적인 어플리케이션이 요구하는 기능들, routing, data fetching, integrations 에 대한 기능들을 제공합니다. 

개인 개발자이든 대규모 팀의 일원이든 React와 Next.js를 활용하여 완전한 대화형, 매우 동적이고 성능이 뛰어난 웹 애플리케이션을 구축할 수 있습니다.