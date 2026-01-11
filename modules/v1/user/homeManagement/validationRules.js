const checkValidatorRules = { 
    productDetail: {
        id: 'required|integer'
    },
    productListing: {
        page: 'integer'
    },
    productListByCategory: {
        categoryId: 'required|integer',
        page: 'integer'
    }
}

export default checkValidatorRules;