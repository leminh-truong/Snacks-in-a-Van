import axios from "axios";

import { 
    deauthenticateUser,
    deauthenticateVendor
} from "./Components/Auth";

const getBaseURL = () => {
    // test if running on heroku
    if (process.env.NODE_ENV === "production"){
        return "https://devdogs.herokuapp.com/api"

    }
    
    // otherwise we running on localhost
    else {
        return "http://localhost:5000/api"
    }
}

// because the headers are different
const vendorAxios = axios.create({
    baseURL: getBaseURL()
});
const customerAxios = axios.create({
    baseURL: getBaseURL()
});


// Some headers that will be sent with every request
customerAxios.interceptors.request.use(
    config => {
        const { origin } = new URL(config.baseURL);
        const allowedOrigins = ["http://localhost:5000", "https://devdogs.herokuapp.com", "http://localhost:3000"]
        const token = localStorage.getItem('cToken');

        if (allowedOrigins.includes(origin)) {
            // & putting the token in the header
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }
);

customerAxios.interceptors.response.use(response => {
    return response
}, error => {
    console.log(error)
    if (error.response.status === 401) {
        // remove their invalid token
         deauthenticateUser();
         // send them away
         window.location.replace("/notloggedin");
     }
     return Promise.reject(error);
})

vendorAxios.interceptors.request.use(
    config => {
        const { origin } = new URL(config.baseURL);
        const allowedOrigins = ["http://localhost:5000", "https://devdogs.herokuapp.com", "http://localhost:3000"]
        const token = localStorage.getItem('vToken');

        if (allowedOrigins.includes(origin)) {
            // & putting the token in the header
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// on the response, check of 401 errors
vendorAxios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        // remove their invalid token
        deauthenticateVendor();
        // send them away
        window.location.replace("/van/login");
    }
    return error;
}
)

export {
    customerAxios,
    vendorAxios
}