const models = require('../models');

module.exports = {
    index:async function(req,res, next){
        try {
            const site = await models.Site.findOne();
            console.log(site);
            res.render('main/index', {site : site});
        } catch (error) {
            next(error);
        }
    }
}