const carts = require("../../models/cartModel");
const user = require('../../models/userModel');
const addresses = require('../../models/addressModel');
const orders = require('../../models/orderModel')
const mongoose = require('mongoose')
const Razorpay = require('razorpay');
require('dotenv/config');

var razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEYID,
    key_secret: process.env.RAZORPAY_SECRET,
});

module.exports = {
    checkoutPage: async (req, res) => {
            let userId = req.session.userId
            console.log(userId);
            let addresss = await addresses.findOne({ userId: userId })
            console.log(addresss);
            let total = 0;
            userId = mongoose.Types.ObjectId(userId)
           let products = await carts.findOne({ userId: userId }).populate('cartItems.productId')
           let subTotal = 0;
           let shippingCost = 0;
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
            if (addresss) {
                let addressdata = addresss.address
                console.log(addressdata);
                res.render('user/checkout', { admin: false, user: true, data: addressdata,status:true, total,userLogged:true })
            } else {
                res.render('user/checkout', { admin:false,user: true,total,data:addresss,status:false,userLogged: true})
            }
    },
     addressAdd:async(req,res)=>{
         const { name,mobile,houseName,district,state,pincode}=req.body
         const userId = req.session.userId
         const adr = await addresses.findOne({userId:userId})
         if(adr){
            await addresses.updateOne({userId:userId},{$push:{address:{name,mobile,houseName,district,state,pincode}}})
         }else{
           await addresses.create({userId:userId,address:{name,mobile,houseName,district,state,pincode}})
         }
         res.redirect('/checkout')
        },

    placeOrder:async(req,res)=>{
        let userId = req.session.userId;   
        let { paymentMethod, address, total } = req.body
      
        if (!req.body.address || !req.body.paymentMethod) {
            res.json({ paymentOrAddress: false })
        } else {
            let status = paymentMethod === 'COD' ? 'placed' : 'pending'
            if (status === 'placed') {
                let addressss = await addresses.findOne({ userId: userId }, { address: { $elemMatch: { _id: address } } });
                addressss = addressss.address[0]
                let cartId = await carts.findOne({ userId: userId }, { 'cartItems._id': 0 })
                cartDetails = cartId.cartItems
                let order = await orders.findOne({ userId: userId })
                if (order) {
                    await orders.updateOne({ userId: userId }, { $push: { orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total } } })
                } else {
                    await orders.create({ userId: userId, orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total } })
                }
                await carts.deleteOne({ userId: userId })
                res.json({ codSuccess: true })
            } else {
                let addressss = await addresses.findOne({ userId: userId }, { address: { $elemMatch: { _id: address } } });
                addressss = addressss.address[0]
                let cartId = await carts.findOne({ userId: userId }, { 'cartItems._id': 0 })
                cartDetails = cartId.cartItems
                let orderr = await orders.findOne({ userId: userId })
                if (orderr) {
                    await orders.updateOne({ userId: userId }, { $push: { orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total,status } } })
                } else {
                    await orders.create({ userId: userId, orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total ,status} })
                }
                await carts.deleteOne({ userId: userId })
                let order = await orders.findOne({ userId: userId }, { orderDetails: { $slice: -1 } }).lean()
                let options = {
                    amount: total * 100,
                    currency: 'INR',
                    receipt: '' + order.orderDetails[0]._id
                }
                razorpayInstance.orders.create(options,
                    (err, order) => {
                        if (!err)
                            res.json(order) 
                        else
                            res.send(err);
                    }
                ) 
            }
        }

    },
    onlinePaymentVerify: async (req, res) => {
        console.log('onlnepv');
        let details = req.body
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', 'uYv5LJ2iLKKz6NfGJwQcvMKT')
        
        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id)
        hmac = hmac.digest('hex')
        if (hmac == details.payment.razorpay_signature) {
            console.log('payment successss');
            await orders.updateOne({orderDetails:{$elemMatch:{_id:details.order.receipt}}},{'orderDetails.$.status':'placed order'})
            res.json({ status: true })
        } else {
            console.log('fails');
            res.json({ status: false })
        }
    },
    orderConfirmation: async (req, res) => {
        userId = req.session.userId
        let order = await orders.findOne({ userId: userId }, { orderDetails: { $slice: -1 } }).lean()
        let orderDetails = order.orderDetails[0]
        let address = orderDetails.address
        let date = orderDetails.createdAt.toString().slice(0,16)
        res.render('user/confirmation', { admin:false,user: true, userLogged: true, address, orderDetails, date })
    },
} 