import productModule from '../model/productModule.js';
import middleware from '../../../../../middleware/headerValidator.js';
import validationRules from '../validationRules.js';
import CODES from '../../../../../app_config/status_code.js';

const product = {

    async createProduct(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.create);
        if (valid.status) {
            return productModule.createProduct(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async listProduct(request, res) {
        return productModule.listProduct(request, res);
    },

    async productDetail(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.getById);
        if (valid.status) {
            return productModule.productDetails(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async updateProduct(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.update);
        if (valid.status) {
            return productModule.updateProduct(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async deleteProduct(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.delete);
        if (valid.status) {
            return productModule.deleteProduct(request, res);
        } else {
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
        }
    },

    async productCount(request, res) {
        return productModule.countProducts(request, res);
    },

    
}

export default product;