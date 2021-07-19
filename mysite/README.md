# MySite on Node(Express)

## 설치 패키지 
```bash
$ npm init -y
$ npm i express
$ npm i express-session
$ npm i ejs
$ npm i dotenv
$ npm i sequelize   
$ npm i -D nodemon   
$ npm i mysql2
$ npm i multer  // multipartresolver --> fileupload 
$ npm i winston // log   
$ npm i winston-daily-rotate-file   
$ npm i moment -> 날짜 포맷을 위한 라이브러리(moment.객체.regDate.format('YYYY-MM-DD')) 

$ npm i -D mocha
$ npm i -D chai
```

## Scripts in package.json
```JSON
.
.
"scripts": {
    "start": "npm index.js",
    "debug": "nodemon index.js",
    "test": "npx mocha"
  },
.
.
```

## Project Structure
<pre>
/mysite
    |--- index. js
    |--- package.json
    |--- package-lock.json
    |---/node-modules
    |--- /test (mocha, chai)
  -------------------------- Application -------
    |--- [multer-temporary-store]
    |--- /config
    |--- /loggin (winston)
    |--- /logs
            |--- [error]
    |--- /multer-temporary-store
    |--- /public (assets...)
            |--- /assets
                    |--- /gallery
    |--- /routes
    |--- /controllers
    |--- /models
    |--- /views
            |--- /main
            |--- /user
            |--- /guestbook
            |--- /board
            |--- /gallery
            |--- /admin
                    |--- /includes
</pre>


---
> index.js -> routes -> Controllers -> models(Sequelize) -> DB(mysql)
<pre>
1. main
    : "/"   
        -> "" 
            -> main:index(Controller)   

2. user 
    : "/user/*" 
        -> "/login(get),
            /login(post),
            /update, 
            /logout, 
            /join"

                -> /joinform, 
                   /join
</pre>


## Stacks

> Sequelize   
> mysql   
> ejs   
> Node   



## 수정사항


1. admin main(index,update) fin -> 전체 title 바꾸기    
2. admin 나머지 부분 완성하기   


