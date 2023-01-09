module.exports= {
    productGet:(req,res)=>{
        data = []
        res.render('admin/products',{products:data,user:false,admin:true})
    }

}