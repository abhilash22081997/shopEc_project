const cartController = require("./cartController");
const user = require('../../models/userModel');
const addresses = require('../../models/addressModel');

module.exports = {
    checkoutPage: async (req, res) => {
            let userId = req.session.userId
            const userData = await user.findOne({ userId: userId })
            let addresss = await addresses.findOne({ userId: userId })
            let total = 0;
            if (addresss) {
                let addressdata = addresss.address
                const userId = mongoose.Types.ObjectId(userId)
                let products = await cartController.findOne({ userId: userId }.populate('cartItems.productId'))
                let subTotal = 0;
                let shippingCost = 0;
                let total = 0;
                let productDetails = products.cartItems
                productDetails.forEach((element) => {
                    subTotal += (element.productId.srp * element.quantity)
                });
                if (subTotal > 500) {
                    shippingCost = 0;
                } else {
                    shippingCost = 50;
                }
                total = subTotal + shippingCost
                res.render('user/checkout', { admin: false, user: true, data: addressdata, total, user: userData,userLogged:true })
            } else {
                res.render('user/checkout', { user: true,total,status:false,userLogged: true})
            }


    }
}