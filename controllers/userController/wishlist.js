const users = require('../../models/userModel')
const product = require('../../models/productModel')
const wishlist = require('../../models/wishlistModel')
const mongoose = require('mongoose')
let carts = require('../../models/cartModel')
const { response } = require('express')
msg = ''
module.exports = {
    addToWishlist: async (req, res) => {
        console.log(req.body)
        const id = mongoose.Types.ObjectId(req.session.userId)
        let proId = mongoose.Types.ObjectId(req.body.proId)
        console.log('h')
        const existWishlist = await wishlist.findOne({ userId: id })
        console.log(existWishlist,">>>>>");
        if (existWishlist) {
            console.log("in 1 if")
            let products = existWishlist.productId
            let existProduct = products.includes(proId, 0);
            console.log(existProduct,">>>>>>Jjjjjjjjjj");
            if (existProduct) {
                console.log("in if 2")
                 res.json({ alreadyExist: true ,userId:req.session.userId})
            } else {
                console.log("fgg")
                 await wishlist.updateOne({ userId: id }, { $push: { productId: proId } })
                 //res.json({ alreadyExist:false});
            }


        }else{
            await wishlist.create({userId:id, productId:proId})
            res.json({session:req.session,alreadyExist:false})
        }

    },
    getWishlist: async (req, res) => {
        const { userId } = req.session
        let wishListExist = await wishlist.find({ userId,productId: { $exists: true, $not: {$size: 0} } }).count()
        if (wishListExist) {
            let wishlistList = await wishlist.findOne({ userId }).populate('productId').lean()
            let productsList = wishlistList.productId 
            res.render('user/wishlist', { user: true, productsList,userLogged:true,admin:false})
        } else{
            let msg = 'Your wishlist is empty'
            res.render('user/wishlist', { user: true, msg ,productsList:false,userLogged:true,admin:false})
        }
    },
    removeWishlist: async (req, res) => {
        console.log('hett');
        try {
            console.log("gfffftfytf");
            let userId = req.session.userId;
            let proId = req.body.proId;
            proId = mongoose.Types.ObjectId(proId);
            console.log(proId + "koooooy");
            await wishlist.updateOne({ userId: userId }, { $pull: { productId: proId } } )
            res.json({ status: true })
        } catch (error) {
            console.log(error.message)
        }
    },

    }


