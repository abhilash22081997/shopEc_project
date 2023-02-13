const carts = require('../../models/cartModel')
const orders = require('../../models/orderModel');

module.exports={
    getOrderDetails:async(req,res)=>{
        let userId= req.session.userId
        let userOrders = await orders.findOne({userId:userId})
        let orderDetails;
        if(userOrders){
            orderDetails = userOrders.orderDetails;
           orderDetails.forEach(e=>{
               date = e.createdAt
               e.date = date.toDateString()
           })
        }
       res.render('user/orderDetails',{user:true,userOrder:true,admin:false,userLogged: true,orderDetails})     
        },
        getSingleOrderDetails:async(req,res)=>{
            let userId=req.session.userId
            let orderId=req.params.id
            let order = await orders.findOne({userId:userId},{orderDetails:{$elemMatch:{_id:orderId}}}).populate('orderDetails.orderItems.productId')
            console.log("<<<<<<<<",order,">>>>>>>>>>>>>>");
            let orderedProducts = order.orderDetails[0].orderItems
            console.log(orderedProducts);
            res.render('user/singleOrderDetails', { admin:false,user: true, userOrder: true,userLogged:true,orderedProducts,userId})

        }     
    }
