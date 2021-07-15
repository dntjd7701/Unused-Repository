const {Sequelize} = require('sequelize');
const models = require("../models");

module.exports = {
    index: async function(req, res){
        try {
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
            guestbooks: list || []
        });     
        } catch (error) {
            next(error);
        }
    },
    _add: async function(req, res){
        console.log(req.body);
        if(req.body.name == "" || req.body.password == "" || req.body.message == ""){
            console.log("data 미입력 ");
            res.redirect('/guestbook');
            return;
        } 
        await models.Guestbook.create(req.body)
        res.redirect("/guestbook");
    },
    // req 엔진에 의해 공유된다.
    delete: async function(req, res){
        // res.render("guestbook/delete", {
        //     no: req.params.no
        // })
        res.render("guestbook/delete");
    },
    _delete: async function(req, res, next){
      try {
          await models.Guestbook.destroy({
              where: req.body
          })
          res.redirect('/guestbook');
      } catch (error) {
          next(error);
      }
    }
}
