// 원래는 next가 있음. express가 알아서 error를 해줌. 그래서 생략 
// 여기서는 해야됌 
module.exports = function(role){
    return function(req,res,next){
        // Logic -> ADMIN check 
        // ADMIN 계정이라면 무조권 들어가야돼.
        if(req.session.authUser && (role !== 'ADMIN' || req.session.authUser.role === 'ADMIN')){
            next();
            return;
        }

        if(req.accepts('html')){
            res.redirect(req.session.authUser ? '/' : '/user/login');
            return;
        }

        // JSON 요청임 
        res.send({
            result: "fail",
            data: null,
            message: "Auth failled"
        })
    }
}