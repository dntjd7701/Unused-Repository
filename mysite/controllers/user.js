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
        console.log(result);
        res.redirect('/user/joinsuccess');
    },
    login: function(req,res){
        res.render('user/login');
    },
    _login: async function(req,res){
        const user = await models.User.findOne({
            attributes: ['no','name','role'], // 받아올 컬럼 
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
    update: function(req,res){
        res.send('update form');
    }
}