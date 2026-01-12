import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import GLOBALS from './constants.js';
import moment from 'moment';
import cloudinaryService from '../utils/cloudinaryService.js';
import db from '../models/index.js';
const { tbl_product_images: ProductImage } = db;


const key = CryptoJS.enc.Utf8.parse(GLOBALS.KEY);
const iv = CryptoJS.enc.Utf8.parse(GLOBALS.IV);

const common = {

    generateOTP(length = 4) {
        return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    },

    async generateRandomToken(length = 64) {
        return crypto.randomBytes(length).toString('hex');
    },

    hashPassword(password) {
        return CryptoJS.AES.encrypt(password, key, { iv: iv }).toString();
    },

    comparePassword(password, encryptedPassword) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedPassword, key, { iv: iv });
            const decryptedPassword = decrypted.toString(CryptoJS.enc.Utf8);
            return password === decryptedPassword;
        } catch (error) {
            return false;
        }
    },

    generateJWT(payload) {
        return jwt.sign(payload, GLOBALS.JWT_SECRET, { expiresIn: GLOBALS.JWT_EXPIRE });
    },

    verifyJWT(token) {
        try {
            return jwt.verify(token, GLOBALS.JWT_SECRET);
        } catch (error) {
            return null;
        }
    },

    async upsertDeviceInfo(userId, deviceToken = '') {
        const DeviceDetails = (await import('../models/tbl_device_details.js')).default;
        const token = this.generateJWT({ userId, timestamp: Date.now() });
        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        const existing = await DeviceDetails.findOne({ where: { user_id: userId } });

        if (existing) {
            await DeviceDetails.update(
                { device_token: deviceToken, token: token, updated_at: now },
                { where: { user_id: userId } }
            );
        } else {
            await DeviceDetails.create({
                user_id: userId,
                device_token: deviceToken,
                token: token,
                created_at: now,
                updated_at: now
            });
        }

        return token;
    },

    async handleProductImages(productId, images, transaction) {
        try {
            if (!images || images.length === 0) {
                throw new Error('No images provided');
            }

            const imageData = await cloudinaryService.uploadMultipleImages(
                images,
                'products'
            );

            if (!imageData || imageData.length === 0) {
                throw new Error('Image upload failed');
            }

            const imagePromises = imageData.map((img, index) =>
                ProductImage.create(
                    {
                        product_id: productId,
                        image_url: img.image_url,
                        is_primary: index === 0 ? 1 : 0
                    },
                    { transaction }
                )
            );

            await Promise.all(imagePromises);
        } catch (error) {
            console.error('Handle product images error:', error);
            throw error; // 🔥 This will trigger rollback
        }
    },
};

export default common;
