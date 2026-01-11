import authModule from '../model/authModule.js';
import middleware from '../../../../../middleware/headerValidator.js';
import validationRules from '../validationRules.js';
import CODES from '../../../../../app_config/status_code.js';

const auth = {

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
        const valid = middleware.checkValidationRules(data, validationRules.changePassword);
        console.log(valid)
        if (valid.status) {
            return authModule.changePassword(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async logout(request, res) {
        return authModule.logout(request, res);
    },

    async getCredentials(request, res) {
        return authModule.getCredentials(request, res);
    },

    async updateProfile(request, res) {
        return authModule.updateProfile(request, res);
    }
}

export default auth;
