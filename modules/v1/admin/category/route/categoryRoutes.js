import express from 'express';
import categoryController from '../controller/categoryController.js';
import upload from '../../../../../utils/multer.js';

const router = express.Router();

router.post('/category-add', upload.single('image'), categoryController.createCategory);
router.post('/category-list', categoryController.listCategory);
router.post('/category-details', categoryController.categoryDetail);
router.post('/category-update', upload.single('image'), categoryController.updateCategory);
router.post('/category-delete', categoryController.deleteCategory);
router.post('/category-count', categoryController.categoryCount);

export default router;