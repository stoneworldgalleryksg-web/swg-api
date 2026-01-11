import express from 'express';
const router = express.Router();
import authRoutes from './auth/route/authRoutes.js';
import categoryRoutes from './category/route/categoryRoutes.js';
import productRoutes from './product/route/productRoutes.js';
import uploadRoutes from './common/route/uploadRoutes.js';

router.use('/', authRoutes);
router.use('/', categoryRoutes);
router.use('/', productRoutes);
router.use('/', uploadRoutes);

export default router;
