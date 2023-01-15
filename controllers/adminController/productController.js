const products = require("../../models/productModel");
const categories = require("../../models/categoryModel");
module.exports= {
    productGet:async(req,res)=>{
        const data=await products.find({})
        res.render('admin/products',{products:data,user:false,admin:true})
        
    } ,
    addProductGet:async (req, res) => {
        const categoryDetails = await categories.find({ status: { $ne: true } })
        res.render('admin/addProduct', { admin: true, category: categoryDetails, product: true,user:false })
        msg = ''
    },
    addProductPost: async (req, res) => {
        req.body.imagePath = req.file.path.replace('public/', '')
        try {
            await products.create(req.body);
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
        }
    },
    productStatus: async (req, res) => {
        try {
            let id = req.query.id;
            const productData = await products.findById(id);
            if (productData.blockStatus) {
            await products.findByIdAndUpdate(id,{$set:{blockStatus:false}});
            } else {
            await products.findByIdAndUpdate(id,{$set:{blockStatus:true}});
            }
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
        }
    },
    productEditGet: async (req, res) => {
        let id = req.query.id;
        const categoryDetails = await categories.find({ status: { $ne: true } })
        let productDetails = await products.findById(id);
       
        res.render('admin/editProducts', { admin: true, data: productDetails, product: true, categoryDetails ,user:false })
    },
    productEditPost:async(req,res)=>{
        try {
            const id = req.params.id;
            let {name, author, language, publisher, isbn, stock, mrp, srp, blockStatus, category, description} = req.body;
            let imagePath;
            if (req.file) {
                imagePath = req.file.path;
                imagePath = imagePath.replace('public/', '');
            } else {
                const productData = await products.findById({_id:id});
                imagePath = productData.imagePath;
            }
            await products.updateOne({_id:id},
                {
                    $set: {
                        name: name,
                        author: author,
                        language: language,
                        publisher: publisher,
                        isbn: isbn,
                        stock: stock,
                        mrp: mrp,
                        srp: srp,
                        blockStatus: blockStatus,
                        category: category,
                        description: description,
                        imagePath: imagePath
                    }
                });
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error.message);
        }

    }
}