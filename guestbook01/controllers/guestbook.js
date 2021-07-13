const model = require("../models/guestbook");

module.exports = {
    index: async function(req, res){
        const results = await model.findAll();
        res.render("index",{
            list: results || []
        });
    },
    add: async function(req, res){
        await model.add(req.body);
        res.redirect("/");
    },
    deleteform: async function(req, res){
        res.render("deleteform", {
            no: req.query.no,
            password: req.query.password
        });
    },
    delete: async function(req, res){
        if(req.query.password_true === req.query.password){
            await model.delete(req.body);
            res.redirect("/");
            return;
        }
        console.log(`input password error : ${req.query.password}`);
        res.redirect("/");
    }


}