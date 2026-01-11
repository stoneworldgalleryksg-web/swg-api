import express from 'express';
import authController from '../controller/authController.js';
import upload from '../../../../../utils/multer.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/change-password', authController.changePassword);
router.post('/logout', authController.logout);
router.get('/get-credentials', authController.getCredentials);
router.put('/update-profile', upload.single('profile_picture'), authController.updateProfile
);

export default router;


