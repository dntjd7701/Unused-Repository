const User = require('../models/User');

module.exports = {
    joinsuccess: function(req,res){
        res.redner('user/joinsuccess');
    },
    joinform: function(req, res){
        res.render('user/joinform');
    },
    join: async function(req, res){
        const result = await User.create({ 
            firstName: "Jane", 
            lastName: "Doe" });
        console.log("Jane's auto-generated ID:", jane.id);
        res.redirect('/user/joinsuccess');
    },
    login: function(req,res){
        res.render('user/loginform');
    }
}