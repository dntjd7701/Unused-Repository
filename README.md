# node-practices

## 설치 패키지
$ npm i express
$ npm i express-session
$ npm i ejs
$ npm i moment -> 날짜 포맷을 위한 라이브러리(moment.객체.regDate.format('YYYY-MM-DD'))
$ npm i -D nodemon
$ npm i mysql2
$ npm i winston //log
$ npm i winston-daily-rotate-file



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

- emaillist : 기본 sql 기반

  - model based mysql

- guestbook

- emaillist02 : ORM
  - model based Sequelize
---

> 순서 (emaillist)

[emaillist]

[emaillist] npm init -y  
[emaillist] npm i express  
[emaillist] npm i ejs  
[emaillist] npm i -D nodemon  
[emaillist] npm i mysql

- package.json 스크립트 수정

```javascript
"scripts": {
"start": "node index.js",
"debug":"nodemon index.js",
}
```

[emaillist] npm start(운용시...)  
[emaillist] npm run debug(개발시...Live Update)

[emaillist] mkdir views  
[emaillist] mkdir routes(routers)  
[emaillist] mkdir controllers  
[emaillist] mkdir models

---
> 순서 (guestbook)

[guestbook]

[guestbook] npm init -y  
[guestbook] npm i express  
[guestbook] npm i ejs  
[guestbook] npm i -D nodemon  
[guestbook] npm i mysql (mac의 경우 mysql2)

- package.json 스크립트 수정

```javascript
"scripts": {
"start": "node index.js",
"debug":"nodemon index.js",
}
```

[guestbook] npm start(운용시...)  
[guestbook] npm run debug(개발시...Live Update)

[guestbook] mkdir views  
[guestbook] mkdir routes(routers)  
[guestbook] mkdir controllers  
[guestbook] mkdir models   
[guestbook] mkdir public

index.js 작성 

---
- mysite (models based on Sequelize) <strong>ORM</strong>

1. orm(Sequelize) -> JS test
2. user(session, 인증, 접근제어), API(jQuery(ajax) + Node API == full stack)
3. views -> include(ejs)
4. dotenv(configuration: DB Connection Info, port, static directory)
5. log(winston)
6. fileupload(multer)   
7. moment -> 날짜 format 라이브러리   


---

url/no

req.params
/delete/:no


url?no=no
req.query
/delete
get