const categories = require('../../models/categoryModel')

module.exports = {
    categoriesGet: async (req, res) => {
        let allCategory = await categories.find()
        console.log(allCategory);
        res.render('admin/categories', { admin: true, user: false, data: allCategory, category: true })
    },
    categoriesPost: async (req, res) => {
        try {
            let imagePath = req.file.path;
            imagePath = imagePath.replace('public/', '');
            const newCategory = new categories({
                category: req.body.name,
                imagePath: imagePath
            })

            const categoryData = await newCategory.save();
            res.redirect('/admin/categories')
        } catch (error) {
            console.log(error.message);
        }
    },
    categoryAction: async (req, res) => {
        try {
            let id = req.query.id;
            const categoryData = await categories.findById(id);
            if (categoryData.status) {
                await categories.findByIdAndUpdate(id, { $set: { status: false } });
            } else {
                await categories.findByIdAndUpdate(id, { $set: { status: true } });
            }
            res.redirect('/admin/categories');
        } catch (error) {
            console.log(error.message);
        }
    },

} 
