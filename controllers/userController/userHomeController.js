const products = require("../../models/productModel")
const categories = require("../../models/categoryModel")
const banners = require("../../models/bannerModel")

module.exports = {

    getHome: async (req, res) => {
        let productDetails = await products.find({ blockStatus: false, categoryBlockStatus: false }).sort({ _id: -1 }).limit(8)
        let banner = await banners.findOne({})
        console.log(banner)
        const category = await categories.find({ status: false })
        if (req.session.userId) {
            res.render('user/userHome', { user: true,banner, admin: false, userLogged: true, category, data: productDetails })
        } else {
            res.render('user/userHome', { user: true,banner, admin: false, userLogged: false, category, data: productDetails })
        }
    },
    getSingleProduct: async (req, res) => {
        let proId = req.params.id
        let proDetails = await products.findOne({ _id: proId })
        if (req.session.userId) {
            res.render('user/singleProduct', { proDetails, user: true, admin: false, userLogged: true })
        } else {
            res.render('user/singleProduct', { proDetails, user: true, admin: false, userLogged: false })
        }
    }
}