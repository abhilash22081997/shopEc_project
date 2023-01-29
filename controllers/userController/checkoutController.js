const carts = require("../../models/cartModel");
const user = require('../../models/userModel');
const addresses = require('../../models/addressModel');
const mongoose = require('mongoose')

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
        }
}