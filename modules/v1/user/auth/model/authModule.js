import moment from 'moment';
import CODES from '../../../../../app_config/status_code.js';
import common from '../../../../../app_config/common.js';
import middleware from '../../../../../middleware/headerValidator.js';
import db from '../../../../../models/index.js';

const { tbl_users: User, tbl_forgot_password: ForgotPassword } = db;

const authModel = {

    async signup(data, res) {
        try {
            const { first_name, last_name, email, mobile, password, device_token } = data;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_email_exists', null);
            }

            const hashedPassword = common.hashPassword(password);
            const now = moment().format('YYYY-MM-DD HH:mm:ss');

            await User.create({
                first_name,
                last_name,
                email,
                mobile,
                password: hashedPassword,
                is_approved: 0,
                created_at: now,
                updated_at: now
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_signup_success', null);
        } catch (error) {
            console.error('Signup error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_signup_failed', null);
        }
    },

    async login(data, res) {
        try {
            const { email, password, device_token } = data;

            const user = await User.findOne({ where: { email, is_deleted: 0 } });
            if (!user) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, 'rest_keywords_user_not_found', null);
            }

            if (!user.is_approved) {
                return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_account_not_approved', null);
            }

            if (!user.is_active) {
                return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_account_inactive', null);
            }

            const isValid = common.comparePassword(password, user.password);
            if (!isValid) {
                return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_invalid_password', null);
            }

            const token = await common.upsertDeviceInfo(user.id, device_token || '');
            await User.update({ last_login: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { id: user.id } });

            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_login_success', {
                id: user.id,
                token,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile: user.mobile,
                is_approved: user.is_approved,
                is_active: user.is_active
            });
        } catch (error) {
            console.error('Login error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_login_failed', null);
        }
    },

    async forgotPassword(data, res) {
        try {
            const { email } = data;

            const user = await User.findOne({ where: { email, is_deleted: 0 } });
            if (!user) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, 'rest_keywords_user_not_found', null);
            }

            const token = await common.generateRandomToken(32);
            const expireAt = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

            await ForgotPassword.create({
                user_id: user.id,
                user_type: 'user',
                forgot_pwd_token: token,
                expire_at: expireAt,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_password_reset_sent', { token });
        } catch (error) {
            console.error('Forgot password error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_request_failed', null);
        }
    },

    async changePassword(data, res) {
        try {
            const { user_id, old_password, new_password } = data;

            const user = await User.findOne({ where: { id: user_id, is_deleted: 0 } });
            if (!user) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, 'rest_keywords_user_not_found', null);
            }

            const isValid = common.comparePassword(old_password, user.password);
            if (!isValid) {
                return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_invalid_old_password', null);
            }

            const hashedPassword = common.hashPassword(new_password);
            await User.update({ password: hashedPassword, updated_at: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { id: user_id } });

            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_password_changed', null);
        } catch (error) {
            console.error('Change password error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_password_change_failed', null);
        }
    },

    async logout(data, res) {
        try {
            const { user_id } = data;
            await common.upsertDeviceInfo(user_id, '');
            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_logout_success', null);
        } catch (error) {
            console.error('Logout error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_logout_failed', null);
        }
    },

    async updateProfile(data, res) {
        try {
            const { user_id, first_name, last_name, mobile, profile_picture } = data;

            const user = await User.findOne({ where: { id: user_id, is_deleted: 0 } });
            if (!user) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, 'rest_keywords_user_not_found', null);
            }

            if (req.file) {
                const folder = 'admin/profile';

                const uploadResult = await cloudinaryService.uploadImage(req.file, folder);

                if (uploadResult?.secure_url) {
                    updateData.profile_picture = uploadResult.secure_url;
                } else {
                    return middleware.sendApiResponse(
                        res,
                        CODES.ERROR,
                        'Failed to upload profile picture',
                        null
                    );
                }
            }


            await User.update({
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                mobile: mobile || user.mobile,
                profile_picture: profile_picture || user.profile_picture,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }, { where: { id: user_id } });

            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_profile_updated', null);
        } catch (error) {
            console.error('Update profile error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_profile_update_failed', null);
        }
    }
};

export default authModel;
