const cart = require('../../models/cartModel')
const mongoose = require('mongoose')

module.exports = {
    addToCart: async (req, res) => {
        try {
            if (req.session.userId) {
                const proId = req.params.productId;
                const productId = new mongoose.Types.ObjectId(proId)
                const userId = req.session.userId;

                const cartExist = await cart.findOne({ userId });

                if (cartExist) {
                    const productExist = await cart.findOne({ $and: [{ userId }, { cartItems: { $elemMatch: { productId } } }] });
                    if (productExist) {
                        await cart.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.quantity": 1 } });
                        res.redirect('/singleProduct/' + proId);
                    } else {
                        await cart.updateOne({ userId }, { $push: { cartItems: { productId, quantity: 1 } } });
                        res.redirect('/singleProduct/' + proId);
                    }
                } else {
                    const cartDetails = cart.create({ userId, cartItems: [{ productId, quantity: 1 }] })
                    res.redirect('/singleProduct/' + proId)
                }
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    getCart: async (req, res) => {
        try {
            if (req.session.userId) {
                let userId = req.session.userId;
                let products = await cart.findOne({ userId: userId }).populate('cartItems.productId')
                let productDetails = products.cartItems;
                if (!products) {
                    res.render('user/cart', { data: productDetails, user: true, admin: false, userLogged: true, msg: 'cart is empty' })
                } else {

                    let subTotal = 0;
                    productDetails.forEach((element) => {
                        subTotal += (element.productId.srp * element.quantity);
                    });


                    res.render('user/cart', { data: productDetails, user: true, admin: false, userLogged: true, msg: '' })
                }
            } else {
                res.redirect('/login')
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}