module.exports= {

    getHome:(req,res)=>{
        res.render('user/userHome',{user:true})
    }
}