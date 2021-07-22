const models = require('../models');
// Routers
const mainRouter = require("./main");
const userRouter = require('./user');
const guestbookRouter = require('./guestbook');
const galleryRouter = require('./gallery');
const boardRouter = require('./board')
const adminRouter = require('./admin');

const userApiRouter = require('./user-api');
const guestbookApiRouter = require('./guestbook-api');
const errorRouter = require('./error');

// Logging
const applicationRouter = {
    setup : async function(application){

        const site = await models.Site.findOne();
        
        // request router 추가로 더하기 
        application 
        .all("*", function (req, res, next) {
          res.locals.req = req; //locals는 꼬옥 잇어 
          res.locals.res = res;
          next();
        })
        .use("/", mainRouter)
        .use("/user", userRouter)
        .use("/guestbook", guestbookRouter)
        .use("/gallery", galleryRouter)
        .use("/board", boardRouter)
        .use('/admin', adminRouter)
        
        .use("/api/user", userApiRouter)
        .use("/api/guestbook", guestbookApiRouter)
        .use(errorRouter.error404)
        .use(errorRouter.error500)
        
        .siteTitle = site.title;
    }
 
}
module.exports = { applicationRouter };