const { Sequelize } = require('sequelize');
const models = require('../models');
//const page = require('./page');


module.exports = {
    index: async function(req,res,next){
        try {
             const users = await models.User.findAll();
             var results;
             for(let user of users){
             results = await models.Board.findAll({
                    include: {
                        model: models.User,
                        attributes: ['name', 'no'],
                        required: true // left join -> inner join으로 바꿔주기 위해서 required: true로 변경
                    },
                    // offset:startNo * 5,
                    // limit: 3
                    order: [
                        ['groupNo', 'DESC'],
                        ['orderNo', 'ASC']
                    ]
                });    
            }
            // 검색어 적용시 수정 필요 
           // page.totalCount(results.length);
            // 현재 페이지, req.query 로 받아와야한다.
            // 일단은 1로 설정 
           // page.currentPage(1);

            res.render('board/list', { boardList : results });
        } catch (error) {
            next(error);
        }
    
    },
    view: async function(req, res, next){
        try {
            const result = await models.Board.findOne({
                where: {
                    no: req.params.no
                }
            });
            ;
            await models.Board.update({
                hit: result.hit + 1
            },{
                where: {
                    no: req.params.no
                }
            });
        //    result.contents.replace(/\\/gi, '</br>');

           // authUser check
           // 1. 로그인을 하지 않은 경우
           // 2. 로그인은 했으나 작성자가 아닌 경우
           // 3. 로그인도 했고, 작성자인 경우 
            const checkAuthUser = req.session.authUser == undefined ? 'needLogin' : (req.session.authUser.no != result.userNo ? 'NotWriter' : 'Writer');
                res.render('board/view', { 
                board : result,
                checkAuthUser : checkAuthUser,
            });

        } catch (error) {
            next(error);
        }
    },
    modify: async function(req, res, next){
        try {
            const result = await models.Board.findOne({
                where: {
                    no: req.params.no
                }
            })
            res.render('board/modify', { board : result });
        } catch (error) {
            next(error);   
        }
    },
    _modify: async function(req, res, next){
            try {
            const {[req.body.contents == '' ? 'contents' : '']: remove, ...updateObject} = req.body;
             await models.Board.update(updateObject, {
                where: {
                    no: req.body.no
                }
            })
            res.redirect('/board');
        } catch (error) {
            next(error);   
        }
     },

    write: function(req, res, next){
        try {
            res.render('board/write');
        } catch (error) {
            next(error);
        }
    },
    _write: async function(req,res,next){
        try {
            const result = await models.Board.max('groupNo');
            const max = isNaN(result) ? 0 : result + 1;

             await models.Board.create(Object.assign(req.body, {
                groupNo: max,
                orderNo: 0,
                depth: 0,
                hit : 0,
                userNo : req.session.authUser.no
            }))

          res.redirect('/board');
        } catch (error) {
            next(error);
        }
    },
    reply: function(req,res){
        res.render('board/reply', { no: req.params.no });
    },
    _reply: async function(req, res, next){
        try {

            await models.Board.update({
                groupNo:"",
                
            }, {
                where : {
                    no: req.params.no
                }
            }
            )
            console.log(req.body + ":" + req.params.no);
            await models.Board.create(Object.assign(req.body,{
            
            }));
        } catch (error) {
            next(error);
        }
    }

}
