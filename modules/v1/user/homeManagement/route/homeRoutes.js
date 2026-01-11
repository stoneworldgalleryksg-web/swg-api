import express from 'express';
import homeController from '../controller/homeController.js';

const router = express.Router();

router.post('/product-detail', homeController.productDetail);
router.post('/products', homeController.productListing);
router.post('/products-by-category', homeController.productListByCategory);
router.get('/categories', homeController.categoryListing);

export default router;