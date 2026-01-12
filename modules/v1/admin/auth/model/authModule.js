import moment from 'moment';
import CODES from '../../../../../app_config/status_code.js';
import common from '../../../../../app_config/common.js';
import middleware from '../../../../../middleware/headerValidator.js';
import db from '../../../../../models/index.js';
import cloudinaryService from '../../../../../utils/cloudinaryService.js';
import localizify from 'localizify';
const { t } = localizify;

const { tbl_admins: Admin, tbl_forgot_password: ForgotPassword, tbl_device_details: DeviceDetails } = db;

const authModel = {

    async login(req, res) {
        try {
            const { email, password } = req;

            const admin = await Admin.findOne({ where: { email, is_deleted: 0 } });
            if (!admin) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_admin_not_found'), null);
            }

            if (!admin.is_active) {
                return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_account_inactive'), null);
            }

            const isValid = common.comparePassword(password, admin.password);
            if (!isValid) {
                return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_invalid_password'), null);
            }

            const token = common.generateJWT({ adminId: admin.id, email: admin.email, type: 'admin' });
            await Admin.update({ last_login: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { id: admin.id } });

            const { password: adminPassword, ...adminData } = admin.toJSON();
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_admin_login_success'), { token, ...adminData });
        } catch (error) {
            console.error('Admin login error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_admin_login_failed'), null);
        }
    },

    async forgotPassword(req, res) {
        try {
            const { email } = req;

            const admin = await Admin.findOne({ where: { email, is_deleted: 0 } });
            if (!admin) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_admin_not_found'), null);
            }

            const token = await common.generateRandomToken(32);
            const expireAt = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

            await ForgotPassword.create({
                user_id: admin.id,
                user_type: 'admin',
                forgot_pwd_token: token,
                expire_at: expireAt,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_password_reset_sent'), { token });
        } catch (error) {
            console.error('Forgot password error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_request_failed'), null);
        }
    },

    async changePassword(req, res) {
        try {
            const adminId = req.user?.adminId;
            const { old_password, new_password } = req.body;
            console.log('AdminId:', adminId);

            if (old_password === new_password) {
                return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_same_password_error'), null);
            }
            const admin = await Admin.findOne({ where: { id: adminId, is_deleted: 0 } });
            const isValid = common.comparePassword(old_password, admin.password);
            if (!isValid) {
                return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_invalid_old_password'), null);
            }

            const hashedPassword = common.hashPassword(new_password);
            await Admin.update({ password: hashedPassword, updated_at: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { id: adminId } });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_password_changed'), null);
        } catch (error) {
            console.error('Change password error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_password_change_failed'), null);
        }
    },

    async getCredentials(req, res) {
        try {
            const adminId = req.user?.adminId;
            console.log("adminId", adminId)
            const admin = await Admin.findOne({
                where: { id: adminId, is_deleted: 0 },
                attributes: { exclude: ['password'] }
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_admin_credentials_success'), admin);
        } catch (error) {
            console.error('Get credentials error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_admin_credentials_failed'), null);
        }
    },

    async updateProfile(req, res) {
        try {
            const adminId = req.user?.adminId;
            const { full_name, email } = req.body;

            const updateData = {
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            if (full_name) updateData.full_name = full_name;
            if (email) updateData.email = email;

            if (req.file) {
                const folder = 'admin/profile';
                const uploadResult = await cloudinaryService.uploadImage(req.file, folder);

                if (uploadResult && uploadResult.secure_url) {
                    updateData.profile_picture = uploadResult.secure_url;
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, 'Failed to upload profile picture', null);
                }
            }

            await Admin.update(updateData, { where: { id: adminId } });

            const updatedAdmin = await Admin.findOne({
                where: { id: adminId },
                attributes: { exclude: ['password'] }
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_profile_updated'), updatedAdmin);
        } catch (error) {
            console.error('Update profile error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_profile_update_failed'), null);
        }
    },

    async logout(req, res) {
        try {
            const adminId = req.user?.adminId;

           
            await DeviceDetails.update(
                { token: "" },
                { where: { user_id : adminId } }
            );

            await Admin.update(
                { updated_at: moment().format('YYYY-MM-DD HH:mm:ss') },
                { where: { id: adminId } }
            );

            return middleware.sendApiResponse( res, CODES.SUCCESS, t('rest_keywords_logout_success'), null
            );

        } catch (error) {
            console.error('Logout error:', error);
            return middleware.sendApiResponse( res, CODES.SERVER_ERROR, t('rest_keywords_logout_failed'), null
            );
        }
    }

};

export default authModel;
