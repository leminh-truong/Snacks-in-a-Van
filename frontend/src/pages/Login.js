import {React, useState} from 'react'
import { useHistory } from "react-router-dom";
import { customerAxios } from '../Config';

import '../styles/CustomerSignUp.scss';
// Authentication functions
import {authenticateUser} from "../Components/Auth";

//import Popup from "../Components/Popup";

function Login() {
    const [formData, setFormData] = useState({});
    const [errorStatus, setErrorStatus] = useState({hasError: false});

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value});

        // And set the error status back to the original state, the user is trying
        // to fix it
        setErrorStatus({...errorStatus, hasError: false});
    }

    const handleSubmit = async (event) => {
        // To prevent the default redirection
        event.preventDefault();
        // Send off to API
        let data = await customerAxios.post("/user/login", formData)
        .catch((err) => {
            setErrorStatus({hasError: true, error: "Server error, Please try again"});
        });

        console.log(data);
        if (data.data === false) {
            setErrorStatus({hasError: true, error: "Wrong email or password"});
        }

        // And sign the user in if indeed the token is returned
        else if (data.data !== undefined){
            // Save the token
            authenticateUser(data.data, "user");

            // And send the user to the home page
            routeChange(`/customer/select-van`);
        }
    }

    return (
        <div className="yellowBox smaller">
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input className="textInput" type="email" id="email" name="email" onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <input className="textInput" type="password" id="password" name="password" onChange={handleChange} />

                <button type="submit" className="submitButton" onSubmit={handleSubmit}>Sign In</button>
            </form>
            <br />
            <div id="error">
                {errorStatus.hasError ? <p id="visible">{errorStatus.error}</p> : <p id="hidden">{errorStatus.error}</p>}
            </div>
        </div>
    );
}

export default Login;