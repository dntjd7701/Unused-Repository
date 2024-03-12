const models = require('../models');

module.exports = {
    index:async function(req,res, next){
        try {
            const site = await models.Site.findOne();
            //global.title = site.title;
            res.render('main/index', {site : site});
           
        } catch (error) {
            next(error);
        }
    }
}