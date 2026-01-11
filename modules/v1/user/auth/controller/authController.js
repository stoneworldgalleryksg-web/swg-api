import authModule from '../model/authModule.js';
import middleware from '../../../../../middleware/headerValidator.js';
import validationRules from '../validationRules.js';
import CODES from '../../../../../app_config/status_code.js';

const auth = {

    async signup(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.register);
        console.log("validation result:", valid);
        if (valid.status) {
            return authModule.signup(data, res);
        }
        return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);

    },

    async login(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.login);
        if (valid.status) {
            return authModule.login(data, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async forgotPassword(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.forgotPassword);
        if (valid.status) {
            return authModule.forgotPassword(data, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async changePassword(request, res) {
        const data = request.body;
        data.user_id = request.user.userId;
        const valid = middleware.checkValidationRules(data, validationRules.changePassword);
        if (valid.status) {
            return authModule.changePassword(data, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async logout(request, res) {
        const data = { user_id: request.user.userId };
        return authModule.logout(data, res);
    },

    async updateProfile(request, res) {
        const data = request.body;
        data.user_id = request.user.userId;
        return authModule.updateProfile(data, res);
    }
}

export default auth;
