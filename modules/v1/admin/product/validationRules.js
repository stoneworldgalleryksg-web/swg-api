const checkValidatorRules = { 
    create: {
        name: 'required|string',
        category_id: 'required|numeric',
        description: 'string'
    },
    update: {
        id: 'required|numeric',
        name: 'string',
        category_id: 'required|numeric',
        description: 'string',
        is_active: 'boolean'
    },
    getById: {
        id: 'required|numeric'
    },
    delete: {
        id: 'required|numeric'
    }
}

export default checkValidatorRules;