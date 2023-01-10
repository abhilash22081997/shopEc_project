const products = require("../../models/productModel");
const categories = require("../../models/categoryModel");
module.exports= {
    productGet:async(req,res)=>{
        const data=await products.find({})
        console.log(data);
        res.render('admin/products',{products:data,user:false,admin:true})
        
    } ,
    addProductGet:async (req, res) => {
        const categoryDetails = await categories.find({ status: { $ne: true } }).lean();
        res.render('admin/addProduct', { admin: true, category: categoryDetails, product: true,user:false })

        msg = ''
    },
    addProductPost: async (req, res) => {
        req.body.imagePath = req.file.path.replace('public/', '')
        try {
            await products.insertOne(req.body);
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
        }
    },
}