const models = require('../models');
const fileUpload = require('./fileupload');

module.exports = {
    _update: async function(req, res, next){
        console.log(req.file == undefined);
        const url = (req.file == undefined) ? undefined : fileUpload.upload(req.file);
        // undefined면 새로 지정을 안한거니까 update 에서 제외하자 
        const form_data = (url == undefined) ? req.body : Object.assign(req.body, { profile: url });
        try {
                await models.Site.update(Object.assign(form_data)
                 ,{
                    where: {
                        no:1
                    }
                })
        } catch (error) {
            next(error);
        }
        res.redirect('/admin');
    },

    index : async function(req, res, next){
        try {
            const results = await models.Site.findOne();
            res.render('admin/main', {
                site: results
            });    
        }catch (error) {
            next(error);       
        }
    }
}