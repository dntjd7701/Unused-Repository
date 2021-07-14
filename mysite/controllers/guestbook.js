const {Sequelize} = require('sequelize');
const models = require("../models");

module.exports = {
    index: async function(req, res){
        const list = await models.Guestbook.findAll({
            attributes: [
                'no', 
                'name',
                'password',
                'message', 
                [Sequelize.fn("date_format", Sequelize.col("reg_date"), "%Y/%m/%d-%hh %mm %ss"), "regDate"]
            ],
            order: [['no', 'DESC']]
        })
        res.render("guestbook/index", {
            list: list || []
        });
    },
    _add: async function(req, res){
        console.log(req.body);
        if(req.body.name == "" || req.body.password == "" || req.body.message == ""){
            console.log("data 미입력 ");
            res.redirect('/guestbook');
            return;
        } 
        // date 처리는 어떻게.. ?
        await models.Guestbook.create({
           name: req.body.name,
           password: req.body.password,
           message: req.body.message,
     })
        res.redirect("/guestbook");
    },
    delete: async function(req, res){
        res.render("guestbook/delete", {
            no: req.query.no
        })
    },
    _delete: async function(req, res){
        const pw = await models.Guestbook.findOne({
            attributes: [
                'password',
            ],
            where: {
                no: req.body.no
            }
        })
        console.log(pw.password == req.body.password);
        if(pw.password == req.body.password){
             await models.Guestbook.destroy({
                 where: {
                    no: req.body.no
                 }
             })
            res.redirect("/guestbook");
            return;
        } else {
        res.redirect("/guestbook");
    }
 }


}