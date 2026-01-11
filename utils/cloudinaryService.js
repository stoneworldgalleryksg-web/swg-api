import { v2 as cloudinary } from 'cloudinary';
import GLOBALS from '../app_config/constants.js';
import moment from 'moment';

cloudinary.config({
    cloud_name: GLOBALS.CLOUDINARY_CLOUD_NAME,
    api_key: GLOBALS.CLOUDINARY_API_KEY,
    api_secret: GLOBALS.CLOUDINARY_API_KEY_SECRET
});

const cloudinaryService = {

    /**
     * Upload single image using stream (FAST)
     */
    uploadImage(file, folder) {
        return new Promise((resolve, reject) => {
            if (!file || !file.buffer) {
                return reject(new Error('Invalid file buffer'));
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            // IMPORTANT: write + end separately
            uploadStream.write(file.buffer);
            uploadStream.end();
        });
    },
    /**
     * Upload multiple images using stream
     */
    async uploadMultipleImages(files, folder) {
        try {
            if (!Array.isArray(files) || files.length === 0) return [];

            const results = [];

            for (let i = 0; i < files.length; i++) {
                console.log(`Uploading image ${i + 1}/${files.length}`);

                const result = await this.uploadImage(files[i], folder);

                results.push({
                    image_url: result.secure_url,
                    public_id: result.public_id,
                    is_primary: i === 0 ? 1 : 0,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            }

            return results;

        } catch (error) {
            console.error('uploadMultipleImages error:', error);
            throw error;
        }
    }

};

export default cloudinaryService;
