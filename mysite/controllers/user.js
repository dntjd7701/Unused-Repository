const models = require('../models'); // directory를 지정하면 index.js가 실행된다. 

module.exports = {
    joinsuccess: function(req,res){
        res.render('user/joinsuccess');
    },
    join: function(req, res){
        res.render('user/join');
    },
    _join: async function(req, res){
        // 물리명이 아닌, 객체 속성명으로 입력해야한다. 
        const result = await models.User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
        });
        res.redirect('/user/joinsuccess');
    },
    login: function(req,res){
        res.render('user/login');
    },
    _login: async function(req,res){
        const user = await models.User.findOne({
            attributes: ['no','name','role','gender','email', 'password'], // 받아올 컬럼 
            where: { // where 절 
                email: req.body.email,
                password: req.body.password
            }
        });
        if(user == null){
            res.render('user/login', Object.assign(req.body, {
                result: 'fail',
                password: '',
                email: 'ㅋㅋㅋㅋ틀림'
            }));
            return;
        }
        // login 처리 
        req.session.authUser = user; // browser끄면 사라짐. 
        res.redirect('/');
    },
    logout: async function(req, res){
        const result = await req.session.destroy();
        console.log(result); //check 용 
        res.redirect("/");
    },
    update: async function(req,res, next){
        try {
            const user = await models.User.findOne({
                attributes: ['no', 'email', 'name', 'gender'],
                where: {
                    no: req.session.authUser.no
                }
            });
            res.render("user/update", { user });
        } catch(e) {
            next(e);
        }
    },
    _update: async function(req, res, next){
    try {
        const {[req.body.password == '' ? 'password' : '']: remove, ...updateObject} = req.body;
        await models.User.update(updateObject, {
            where: {
                no: req.session.authUser.no    
            }
        });
        req.session.authUser.name=updateObject.name;
        res.redirect("/user/update");
    } catch(e) {
        next(e);
    }    
}
}






/**
 *  원래는 next와 try catch문을 사용해야한다. route쪽의 error handler로 들어가게된다.
 */


/*
_update: async function(req, res, next){
        try {
         const result = await models.User.update({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password || req.session.authUser.password,
                gender: req.body.gender
        },{
            where: {
                no: req.session.authUser.no
            }
         });
        req.session.destroy();
        res.redirect("/user/login");
    } catch (error) {
        next(error); //error를 화면에 출력 
    }
    }
}
*/

/*
update: async function(req,res, next){
        본인은 authUser를 사용했으나, 새롭게 찾아서 하는 방법도 있다. 
        try {
            res.render('user/update');
        } catch (error) {
            next(error);
        }
       },
*/