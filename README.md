# node-practices

>

    nodeJS
    mysql
    ejs

---

- 바닥에서 웹어플리케이션 만들어보기

  - app01. based on http : core module ( 서버 연결, 매우 원시적 )
  - app02. based on (http, fs) : core module

  - app03. based on (connect, serve-static) : npm package(module)
  - app04. based on (connect, serve-static, connect-route) : npm package(module)

/index.html  
/guestbook.html  
/images/qr.jpeg  
와 같은 자원 검색

자원 + application 경로
(라우팅 작업)

/guestbook/list
/board/10
/

과 같은

helloweb-ex02 based on express  
 : npm package(module)

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

==========================================================================

- emaillist01 : 기본 sql 기반

  - model based mysql

- guestbook01

- emaillist02 : ORM
  - model based Sequelize
---

> 순서 (emaillist01)

[emaillist01]

[emaillist01] npm init -y  
[emaillist01] npm i express  
[emaillist01] npm i ejs  
[emaillist01] npm i -D nodemon  
[emaillist01] npm i mysql

- package.json 스크립트 수정

```javascript
"scripts": {
"start": "node index.js",
"debug":"nodemon index.js",
}
```

[emaillist01] npm start(운용시...)  
[emaillist01] npm run debug(개발시...Live Update)

[emaillist01] mkdir views  
[emaillist01] mkdir routes(routers)  
[emaillist01] mkdir controllers  
[emaillist01] mkdir models

---
> 순서 (guestbook01)

[guestbook01]

[guestbook01] npm init -y  
[guestbook01] npm i express  
[guestbook01] npm i ejs  
[guestbook01] npm i -D nodemon  
[guestbook01] npm i mysql (mac의 경우 mysql2)

- package.json 스크립트 수정

```javascript
"scripts": {
"start": "node index.js",
"debug":"nodemon index.js",
}
```

[guestbook01] npm start(운용시...)  
[guestbook01] npm run debug(개발시...Live Update)

[guestbook01] mkdir views  
[guestbook01] mkdir routes(routers)  
[guestbook01] mkdir controllers  
[guestbook01] mkdir models   
[guestbook01] mkdir public

index.js 작성 

---