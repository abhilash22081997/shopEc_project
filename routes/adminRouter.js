const router = require('express').Router()
const adminController=require('../controllers/adminController/loginController')
const userController=require('../controllers/adminController/userController')
const categoryController = require('../controllers/adminController/categoryController')
const productController = require('../controllers/adminController/productController')

const uploadToFile = require('../middleware/multer');

router.get('/',adminController.loginGet)

router.post('/',adminController.loginPost)
router.get('/userDetails',userController.userGet)
router.get('/userAction',userController.userAction)

router.get('/categories',categoryController.categoriesGet)
router.post('/categories',uploadToFile.single('image', 12),categoryController.categoriesPost)
router.get('/products',productController.productGet)


module.exports=router;