const logger = require('../logging');

module.exports = {
    error404: function(req,res){
        // url을 주지 않고 들어온것 (404처리) -> default servlet과 같은 ! 없는 것들의 처리)
        if(req.accepts('html')){
          res.status(404).render('error/404');
          return;
      }
      res.status(404).send({
          result: "fail",
          data : null,
          message:'Unknown Request'
      })
    },

    error500: function(err,req,res,next){
    // 1. logging 처리 
    // err.name, err.message, err.stack
    logger.error(err.stack);
    // 2. 사과하기 ( 좋은 사과 페이지 보여주자 )
    // 브라우저한테 500 error라고 알리고, 준비한 500 body가 있으면 rendering해준다.
    // 개발 중 에러를 보기위해 잠시 막아두자. 
    
    // 응답 
    // res.status(500).render('error/500');
    if(req.accepts('html')){
      res.status(500).send(`<pre>${err.stack}</pre>`); // 개발용 
      return;
   }
     res.status(500).send({
    result: "fail",
    data : null,
    message: err.stack
  })
 }
}




/*
    url을 주지 않고 들어온것 (404처리) -> default servlet과 같은 ! 없는 것들의 처리)
  .use((req,res) => res.status(404).render('error/404'))


  // 500 error
  .use(function(err,req,res,next){
    // 1. logging 처리 
    // err.name, err.message, err.stack
    logger.error(err.stack);
    // 2. 사과하기 ( 좋은 사과 페이지 보여주자 )
    // 브라우저한테 500 error라고 알리고, 준비한 500 body가 있으면 rendering해준다.
    // 개발 중 에러를 보기위해 잠시 막아두자. 
    
    // res.status(500).render('error/500');
    res.status(500).send(`<pre>${err.stack}</pre>`); // 개발용 
    
  })
*/