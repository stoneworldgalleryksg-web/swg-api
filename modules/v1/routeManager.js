import express from 'express';
const router = express.Router();

import middleware from '../../middleware/headerValidator.js';
import userRoutes from './user/user_routes.js';
import adminAuthRoutes from './admin/auth/route/authRoutes.js';
import adminRoutes from './admin/admin_routes.js';
import homeRoutes from './user/homeManagement/route/homeRoutes.js';
import uploadRoutes from './admin/common/route/uploadRoutes.js';

router.use("/", middleware.extractHeaderLanguage);
router.use("/", middleware.decryption);
router.use("/", middleware.validateHeaderApiKey);
router.use("/", middleware.validateHeaderToken);

router.use("/user", userRoutes);
router.use("/home", homeRoutes);
router.use("/admin/auth", adminAuthRoutes);
router.use("/admin", adminRoutes);

router.use("/upload", uploadRoutes);

export default router;  