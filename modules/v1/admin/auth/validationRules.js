const checkValidatorRules = { 
    login: {
        email: 'required|email',
        password: 'required'
    },
    forgotPassword: {
        email: 'required|email'
    },
    changePassword: {
        old_password: 'required',
        new_password: 'required'
    }
}

export default checkValidatorRules;
