const router = require('express').Router()
const userLoginController=require('../controllers/userController/userLoginController')
const userHomeController = require('../controllers/userController/userHomeController')





router.get('/signup',userLoginController. getSignupPage)

router.post('/signup',userLoginController.postSignupPage)

router.get('/login',userLoginController.getLoginPage)

router.post('/login',userLoginController.postLoginPage)

router.get('/',userHomeController.getHome)
 
router.get('/singleProduct/:id',userHomeController.getSingleProduct)



module.exports = router;  