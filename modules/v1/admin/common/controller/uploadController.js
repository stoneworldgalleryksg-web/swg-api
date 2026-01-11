import cloudinaryService from '../../../../../utils/cloudinaryService.js';
import middleware from '../../../../../middleware/headerValidator.js';
import CODES from '../../../../../app_config/status_code.js';
import StaticFile from '../../../../../models/tbl_static_files.js';
import moment from 'moment';

const uploadController = {
    async uploadStaticFiles(req, res) {
        try {
            const files = req.files || [];
            const folder = req.body.folder || 'static-files';

            if (!files || files.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.INVALID_REQUEST,
                    'No files provided',
                    null
                );
            }

            const uploadResults = [];

            for (const file of files) {
                try {
                    const result = await cloudinaryService.uploadImage(file, folder);
                    
                    await StaticFile.upsert({
                        id: 1,
                        file_url: result.secure_url,
                        is_active: 1,
                        is_deleted: 0,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    });
                    
                    uploadResults.push({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        original_filename: file.originalname
                    });
                } catch (uploadError) {
                    console.error('File upload error:', uploadError);
                    return middleware.sendApiResponse(
                        res,
                        CODES.INVALID_REQUEST,
                        `Failed to upload file: ${file.originalname}`,
                        null
                    );
                }
            }

            return middleware.sendApiResponse(
                res,
                CODES.SUCCESS,
                'Files uploaded successfully',
                { uploaded_files: uploadResults }
            );
        } catch (error) {
            console.error('Upload static files error:', error);
            return middleware.sendApiResponse(
                res,
                CODES.INVALID_REQUEST,
                'Upload failed',
                null
            );
        }
    },

    async listStaticFiles(req, res) {
        try {
            const files = await StaticFile.findAll({
                where: {
                    is_deleted: 0,
                    is_active: 1
                },
                attributes: ['id', 'file_url', 'created_at', 'updated_at'],
                order: [['created_at', 'DESC']]
            });

            return middleware.sendApiResponse(
                res,
                CODES.SUCCESS,
                'Static files retrieved successfully',
                files
            );
        } catch (error) {
            console.error('List static files error:', error);
            return middleware.sendApiResponse(
                res,
                CODES.INVALID_REQUEST,
                'Failed to retrieve files',
                null
            );
        }
    }
};

export default uploadController;