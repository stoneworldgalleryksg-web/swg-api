import express from 'express';
import productController from '../controller/productController.js';
import upload from '../../../../../utils/multer.js';

const router = express.Router();

router.post('/product-add', upload.array('images', 5), productController.createProduct);
router.post('/product-list', productController.listProduct);
router.post('/product-details', productController.productDetail);
router.post('/product-update', upload.array('images', 5), productController.updateProduct);
router.post('/product-delete', productController.deleteProduct);
router.post('/product-count', productController.productCount);


export default router;