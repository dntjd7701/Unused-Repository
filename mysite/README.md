# MySite on Node(Express)

## 설치 패키지 
```bash
$ npm init -y
$ npm i express   
$ npm i ejs
$ npm i dotenv
$ npm i sequelize   
$ npm i -D nodemon   
$ npm i mysql2   
```

## Scripts in package.json
```JSON
.
.
"scripts": {
    "start": "npm index.js",
    "debug": "nodemon index.js"
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
  -------------------------- Application -------
    |--- /config
    |--- /public (assets...)
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