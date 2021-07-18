const models = require('../models');

module.exports = {
    index:async function(req,res, next){
        try {
            const site = await models.Site.findOne();
            // title 전역 등록 
            global.title = site.title;
            res.render('main/index', {site : site});
           
        } catch (error) {
            next(error);
        }
    }
}