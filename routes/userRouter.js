const router = require('express').Router()
const userLoginController=require('../controllers/userController/userLoginController')
const userHomeController = require('../controllers/userController/userHomeController')
const cartController = require('../controllers/userController/cartController')
const checkoutController = require('../controllers/userController/checkoutController')
const authUser = require('../middleware/authUser').authUser





router.get('/signup',userLoginController. getSignupPage)

router.post('/signup',userLoginController.postSignupPage)

router.get('/login',userLoginController.getLoginPage)

router.post('/login',userLoginController.postLoginPage)

router.get('/',userHomeController.getHome)
 
router.get('/singleProduct/:id',userHomeController.getSingleProduct)

router.get('/addToCart/:productId',cartController.addToCart)

router.get('/cart',cartController.getCart)

router.post('/changeProductQuantity',cartController.changeQuantity)

router.post('/removeFromCart',cartController.removeFromCart)

router.get('/checkout',authUser,checkoutController.checkoutPage)

router.post('/addAddress',authUser,checkoutController.addressAdd)

router.post('/placeOrder',authUser,checkoutController.placeOrder)

router.post('/verifyPayment',authUser,checkoutController.onlinePaymentVerify)

router.get('/confirmation',authUser,checkoutController.orderConfirmation)

router.get('/logout',authUser,userLoginController.logout)

router.get('/orderDetails',authUser,userLoginController.orderDetails)
  
module.exports = router;   