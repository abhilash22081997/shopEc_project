const router = require('express').Router()
const adminController=require('../controllers/adminController/loginController')
const userController=require('../controllers/adminController/userController')
const categoryController = require('../controllers/adminController/categoryController')
const productController = require('../controllers/adminController/productController')
const bannerController = require('../controllers/adminController/bannerController')
const uploadToFile = require('../middleware/multer');

router.get('/',adminController.loginGet)

router.post('/',adminController.loginPost)

router.get('/home',adminController.adminHome)

router.get('/userDetails',userController.userGet)

router.get('/userAction',userController.userAction)

router.get('/categories',categoryController.categoriesGet)

router.post('/categories',uploadToFile.single('image', 12),categoryController.categoriesPost)

router.get('/categoryAction',categoryController.categoryAction)

router.get('/products',productController.productGet)

router.get('/addProduct',productController.addProductGet)

router.post('/addProduct',uploadToFile.single('image',12),productController.addProductPost)

router.get('/productStatus',productController.productStatus)

router.get('/editProduct',productController.productEditGet)

router.post('/editProduct/:id',uploadToFile.single('image',12),productController.productEditPost)

router.get('/banner',bannerController.bannerGet)

router.post('/banner',uploadToFile.single('imagePath', 12),bannerController.bannnerPost)

module.exports=router;
