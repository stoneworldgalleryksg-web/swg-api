const checkValidatorRules = { 
    login: {
        email: 'required|email',
        password: 'required'
    },
    register: {
        first_name: 'required',
        last_name: 'required',
        email: 'required|email',
        mobile: 'required',
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