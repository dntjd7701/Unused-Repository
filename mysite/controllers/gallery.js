const {Sequelize} = require('sequelize');
const models = require('../models');
const fileUpload = require('./fileupload');

module.exports = {
    index: async function(req, res, next){
        try {
          const results =  await models.Gallery.findAll({
               attributes: ['no','url','comment'],
               order: [['no','desc']]
            });
            res.render('gallery/index',{
                galleries : results
            });
        } catch (error) {
            next(error);
        }
    },
    upload: async function(req,res, next){
        try {
            const url = fileUpload.upload(req.file);
            console.log(url);
            await models.Gallery.create({
                url: url,
                comment: req.body.comment || ''
            });
            res.redirect('/gallery');
        } catch (error) {
            next(error);
        }
    },
    delete: async function(req, res, next){
        try {
            const results = await models.Gallery.destroy({
                where: {
                    no: req.params.no       
                }
            });
            
            res.redirect('/gallery');

        } catch (error) {
            next(error);
        }
    }
}
