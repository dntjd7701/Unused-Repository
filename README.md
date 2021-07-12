# node-practices

바닥에서 웹어플리케이션 만들어보기

- app01. based on http : core module ( 서버 연결, 매우 원시적 )
- app02. based on (http, fs) : core module

- app03. based on (connect, serve-static) : npm package(module)

/index.html
/guestbook.html
/images/qr.jpeg
와 같은 자원 검색

- app04. based on (connect, serve-static, connect-route) : npm package(module)

자원 + application 경로
(라우팅 작업)

/guestbook/list
/board/10
/

과 같은

- helloweb-ex02 based on express : npm package(module)

npm i express
npm i ejs
npm i -D nodemon

package.json 스크립트 수정

"scripts": {
"start": "node index.js",
"debug":"nodemon index.js",
}

npm start(운용시...)
npm run debug(개발시...Live Update)

mkdir public(assets)
mkdir views
mkdir routes(routers)
mkdir controllers
mkdir models
