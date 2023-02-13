module.exports={
    authUser:(req,res,next)=>{
        let user = req.session.userId
        if(user){
            return next()
        }
        else{
            if(req.xhr){
                console.log("it's ajax logged false");
                res.json({userLogged:false});
            }else{
                res.redirect('/login');
            }
            
        }
    }
}   