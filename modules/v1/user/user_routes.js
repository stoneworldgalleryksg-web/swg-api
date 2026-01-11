import express from 'express';
const router = express.Router();
import authRoutes from './auth/route/authRoutes.js';
import homeRoutes from './homeManagement/route/homeRoutes.js';

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);

export default router;
