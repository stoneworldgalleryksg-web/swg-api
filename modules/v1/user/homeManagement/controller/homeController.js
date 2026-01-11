import homeModule from '../module/homeModule.js';
import middleware from '../../../../../middleware/headerValidator.js';
import validationRules from '../validationRules.js';
import CODES from '../../../../../app_config/status_code.js';

const homeController = {

    async productDetail(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.productDetail);
        if (valid.status) {
            return homeModule.productDetail(data, res);
        }
        return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
    },

    async productListing(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.productListing);
        if (valid.status) {
            return homeModule.productListing(data, res);
        }
        return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
    },

    async categoryListing(request, res) {
        const data = request.body;
        return homeModule.categoryListing(data, res);
    },

    async productListByCategory(request, res) {
        const data = request.body;
        const valid = middleware.checkValidationRules(data, validationRules.productListByCategory);
        if (valid.status) {
            return homeModule.productListByCategory(data, res);
        }
        return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, valid.error, null);
    }

}

export default homeController;