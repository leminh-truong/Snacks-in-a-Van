const authenticateUser = (token) => {
    localStorage.setItem("cToken", token);
}

const authenticateVendor = (token) => {
    localStorage.setItem("vToken", token);
}

// Removes the token from the localStorage
const deauthenticateUser = () => {
    localStorage.removeItem("cToken");
}

const deauthenticateVendor = () => {
    localStorage.removeItem("vToken");
}

const isUserAuthenticated = () => {
    return localStorage.getItem("cToken") !== null;
}

const isVendorAuthenticated = () => {
    return localStorage.getItem("vToken") !== null;
}

const checkPasswordPolicy = candidate => {
    // a regexp for the policy (length was handled already (and is
    // looked after in the database too))
    const policy = /(?=.*[A-Za-z])(?=.*\d)/

    return policy.test(candidate);
}

export {
    authenticateUser,
    authenticateVendor,
    deauthenticateUser,
    deauthenticateVendor,
    isUserAuthenticated,
    isVendorAuthenticated,
    checkPasswordPolicy
}