// 원래는 next가 있음. express가 알아서 error를 해줌. 그래서 생략 
// 여기서는 해야됌 
module.exports = function(req,res,next){
    if(req.session.authUser){
        // null이 아니면 다음꺼 실행해 ! -> controller.update 실행 
        next();
        return;
    }
    if(req.accepts('html')){
       res.redirect("/user/login");
        return;
    }

    // JSON 요청임 
    res.send({
        result: "fail",
        data: null,
        message: "Auth failled"
    })
}