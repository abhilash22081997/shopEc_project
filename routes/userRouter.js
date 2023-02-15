const router = require('express').Router()
const userLoginController=require('../controllers/userController/userLoginController')
const userHomeController = require('../controllers/userController/userHomeController')
const cartController = require('../controllers/userController/cartController')
const checkoutController = require('../controllers/userController/checkoutController')
const orderController = require('../controllers/userController/order')
const authUser = require('../middleware/authUser').authUser
const wishlistController = require('../controllers/userController/wishlist')




router.get('/signup',userLoginController. getSignupPage)

router.post('/signup',userLoginController.postSignupPage)

router.get('/login',userLoginController.getLoginPage)

router.post('/login',userLoginController.postLoginPage)

router.get('/',userHomeController.getHome)
 
router.get('/singleProduct/:id',userHomeController.getSingleProduct)

router.get('/addToCart/:productId',cartController.addToCart)

router.get('/addToCartWish/:productId',cartController.addToCartWish)

router.get('/cart',cartController.getCart)

router.post('/changeProductQuantity',cartController.changeQuantity)

router.post('/removeFromCart',cartController.removeFromCart)

router.get('/checkout',authUser,checkoutController.checkoutPage)

router.post('/addAddress',authUser,checkoutController.addressAdd)

router.post('/placeOrder',authUser,checkoutController.placeOrder)

router.post('/verifyPayment',authUser,checkoutController.onlinePaymentVerify)

router.get('/confirmation',authUser,checkoutController.orderConfirmation)

router.get('/logout',authUser,userLoginController.logout)

router.get('/orderDetails',authUser,orderController.getOrderDetails)
 
router.get('/singleOrderDetails/:id',authUser,orderController.getSingleOrderDetails)

router.post('/addToWishlist',authUser,wishlistController.addToWishlist)
  
router.get('/wishlist',authUser,wishlistController.getWishlist)

router.post('/removeFromWishlist',authUser,wishlistController.removeWishlist)

router.post('/applyCoupon',authUser,cartController.applyCoupon)

router.post('/proceedtoCheckout',authUser,checkoutController.proceedtoCheckout)

module.exports = router;   