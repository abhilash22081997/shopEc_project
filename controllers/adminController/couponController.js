const coupons = require('../../models/coupenModel') 

module.exports = {
    couponGet:async(req,res)=>{
        const couponDetails = await coupons.find({}).lean()
        res.render('admin/coupons',{admin:true,coupon:true,data:couponDetails,user:false})
    },
    couponPost:async(req,res)=>{
        try {
            let {code,percentage} = req.body
            await coupons.create({code,percentage})
            res.redirect('/admin/coupons')
        } catch (error) {
            console.log(error.message);
        }
    },
    couponAction:async(req,res)=>{
        couponId = req.query.id;
        console.log(couponId);
        await coupons.updateOne({_id:couponId},[ { "$set": { "status": { "$eq": [false, "$status"] } } } ])
        res.redirect('/admin/coupons')
    }
}