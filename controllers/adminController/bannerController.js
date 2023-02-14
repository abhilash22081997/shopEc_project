const banners = require('../../models/bannerModel')

module.exports ={
    bannerGet:async (req, res) => {
        const bannerDetails = await banners.findOne({}).lean()
        res.render('admin/banner', { admin: true, banner: true ,bannerDetails,user:false})
    },
    bannnerPost: async (req,res) => {
        req.body.imagePath = req.file.path.replace('public/', '');
        try {
            await banners.findOneAndDelete({})
            await banners.create(req.body);
            res.redirect('/admin/banner');
        } catch (error) {
            console.log(error.message);
        } 
    }
}
