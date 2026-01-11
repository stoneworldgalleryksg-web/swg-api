import categoryModule from '../model/categoryModule.js';
import middleware from '../../../../../middleware/headerValidator.js';
import validationRules from '../validationRules.js';
import CODES from '../../../../../app_config/status_code.js';

const category = {

    async createCategory(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.create);
        if (valid.status) {
            return categoryModule.createCategory(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async listCategory(request, res) {
        return categoryModule.listCategory(request, res);
    },

    async categoryDetail(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.getById);
        if (valid.status) {
            return categoryModule.getCategoryById(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async updateCategory(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.update);
        if (valid.status) {
            return categoryModule.updateCategory(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async deleteCategory(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.delete);
        if (valid.status) {
            return categoryModule.deleteCategory(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async categoryCount(request, res) {
        return categoryModule.categoryCount(request, res);
    }
}

export default category;