const categories = require('../../models/categoryModel')

module.exports = {
    categoriesGet: async (req, res) => {
        let allCategory = await categories.find({}).lean()
        console.log(allCategory);
        res.render('admin/categories', { admin: true,user:false, data: allCategory, category: true })
    },
    categoriesPost: async (req, res) => {
        try {
            let imagePath = req.file.path;
            imagePath = imagePath.replace('public/', '');
            const newCategory = new categories({
                category:req.body.name,
                imagePath: imagePath,
                status:0
            })
    
            const categoryData = await newCategory.save();
            res.redirect('/admin/categories')
        } catch(error) {
            console.log(error.message);
        }
    }
}   