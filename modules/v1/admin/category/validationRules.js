const checkValidatorRules = { 
    create: {
        name: 'required|string|min:2|max:150',
        story: 'string|max:1000'
    },
    update: {
        id: 'required|numeric',
        name: 'string|min:2|max:150',
        story: 'string|max:1000',
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