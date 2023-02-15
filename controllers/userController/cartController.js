const cart = require('../../models/cartModel')
const coupon = require('../../models/coupenModel')
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
            let subTotal = 0;
            let userId = req.session.userId;
            let products = await cart.findOne({ userId: userId }).populate('cartItems.productId')
            let productDetails = products.cartItems;
            if (!products) {
                res.render('user/cart', { data: productDetails, user: true, admin: false, userLogged: true, subTotal, couponDiscount:0 })
            } else {


                productDetails.forEach((element) => {
                    subTotal += (element.productId.srp * element.quantity);
                });


                res.render('user/cart', { data: productDetails, user: true, admin: false, userLogged: true, subTotal, couponDiscount:0 })
            }
        } catch (error) {
            console.log(error.message)
        }
    },

    changeQuantity: async (req, res) => {
        try {
            let userId = req.session.userId
            console.log(req.body)
            let { proId, count } = req.body
            count = parseInt(count);
            proId = mongoose.Types.ObjectId(proId);
            await cart.updateOne({ userId: userId, 'cartItems.productId': proId }, { $inc: { 'cartItems.$.quantity': count } })
            res.json({ status: true })
        } catch (error) {
            console.log(error.message)
        }
    },
    removeFromCart: async (req, res) => {
        try {
            let userId = req.session.userId;
            let proId = req.body.proId;
            proId = mongoose.Types.ObjectId(proId);
            await cart.updateOne({ userId: userId }, { $pull: { cartItems: { productId: proId } } })
            res.json({ status: true })
        } catch (error) {
            console.log(error.message)
        }
    },
    addToCartWish: async (req, res) => {
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
                        res.redirect('/wishlist');
                    } else {
                        await cart.updateOne({ userId }, { $push: { cartItems: { productId, quantity: 1 } } });
                        res.redirect('/wishlist');
                    }
                } else {
                    const cartDetails = cart.create({ userId, cartItems: [{ productId, quantity: 1 }] })
                    res.redirect('/wishlist');
                }
            } else {
                res.redirect('/login');
            }   
        } catch (error) {
            console.log(error.message);
        }
    },
    applyCoupon: async (req, res) => {
        try {
            let { couponCode } = req.body;
            console.log(couponCode);
            let subTotal_forCoupon = 0;
            const cartData = await cart.findOne({userId: req.session.userId}).populate('cartItems.productId');
            console.log('hello = ',cartData);
            let productDetails = cartData.cartItems;
                productDetails.forEach((element) => {
                    subTotal_forCoupon += (element.productId.srp * element.quantity);
                });
            couponCode = couponCode.toUpperCase();
            const couponData = await coupon.findOne({ code:couponCode, status: true});
            if (!couponData) {
                console.log('inside null');
                res.json({invalid:true});
            } else {
                await coupon.findOne({ code:couponCode, status: true }).then((result) => {
                    res.json(result);
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    
}