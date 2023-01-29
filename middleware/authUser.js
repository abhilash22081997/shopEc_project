module.exports={
    authUser:(req,res,next)=>{
        let user = req.session.userId
        if(user){
            return next()
        }
        else{
            res.redirect('/login');
        }
    }
}   