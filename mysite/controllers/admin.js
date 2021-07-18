const models = require('../models');
const fileUpload = require('./fileupload');

module.exports = {
    // main
    _update: async function(req, res, next){
        console.log(req.file == undefined);
        const url = (req.file == undefined) ? undefined : fileUpload.upload(req.file);
        // undefined면 새로 지정을 안한거니까 update 에서 제외하자 
        const form_data = (url == undefined) ? req.body : Object.assign(req.body, { profile: url });
        try {
            const results =  await models.Site.update(Object.assign(form_data)
                 ,{
                    where: {
                        no:1
                    }
                })

            if(results){
                global.title = req.body.title;
                console.log(title);
            }
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
    },
    // user
    // 차후에 사용자 정보 등록하고 삭제까지 할 수 있게 하자

    user_index: function(req, res, next){
        res.render("admin/user");
    },

    guestbook_index: function(req, res, next){
        res.render('admin/guestbook');
    }
}