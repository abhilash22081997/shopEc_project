const carts = require('../../models/cartModel')
const orders = require('../../models/orderModel')

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
        }     
    }
