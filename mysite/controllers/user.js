const models = require('../models'); // directory를 지정하면 index.js가 실행된다. 

module.exports = {
    joinsuccess: function(req,res){
        res.redner('user/joinsuccess');
    },
    joinform: function(req, res){
        res.render('user/joinform');
    },
    join: async function(req, res){
        await User.create({ firstName: "Jane", lastName: "Doe" });
        // const result = await User.create({
        //     firstName: "Jane",
        //     lastName: "Doe"
        // });

        res.redirect('/user/joinsuccess');
    },
    login: function(req,res){
        res.render('user/loginform');
    }
}