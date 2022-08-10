const result = {
    valid: true,
    message: ''
}

const UserValidator = (email, password, passwordCheck) => {
    
    if (!email || !password || !passwordCheck)
    {
        result.valid = false;
        result.message = "Not all fields have been entered.";

        return result;
    };
    if (password.length < 5)
    {
        result.valid = false;
        result.message = "The password needs to be at least 5 characters long.";

        return result;
    };
    if (password !== passwordCheck)
    {
        result.valid = false;
        result.message = "Enter the same password twice for verification.";

        return result;
    };
    return result;
}

export default UserValidator;