import {React, useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { customerAxios } from '../Config';

import { authenticateUser, checkPasswordPolicy } from '../Components/Auth';
import '../styles/CustomerSignUp.scss';
import Popup from '../Components/Popup.js';


// TODO log the user in AND make sure each field is filled
function CustomerSignUp() {
    const PASSWORD_MIN_LENGTH = 8;

    const REQ_INPUTS = ["firstName", "lastName", "email", "password"];

    const [formData, setFormData] = useState({});
    const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
    const [isGenericErrPopupOpen, setIsGenericErrPopupOpen] = useState(false);
    // To check the status of the filling of each box
    const [isFilled, setIsFilled] = useState([]);

    const openCloseEmailPopup = () => {
        setIsEmailPopupOpen(!isEmailPopupOpen);
    }
    
    const openCloseGenericErrPopup = () => {
        setIsGenericErrPopupOpen(!isGenericErrPopupOpen);
    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value});
    }

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    const checkFilled = () => {
        // Get the inputs that the user has put in
        var filled = Object.keys(formData);

        // and work out which ones need to be filled still
        var empty = REQ_INPUTS.filter(x => !filled.includes(x));

        setIsFilled(empty);

        if (empty.length !== 0){
            return false;
        }

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // submit to the DB
        try {
            // Prevent the default reloading of page
            event.preventDefault();
            // Check if filled
            if (!checkFilled() || formData.password.length < PASSWORD_MIN_LENGTH)
                return;

            const res = await customerAxios.post("/user/create", formData);
            
            if (res !== undefined){
                // Authenticate the user
                authenticateUser(res.data);

                // And send the user to the home page
                routeChange(`/customer/select-van`);
            }
        }
        catch (error) {
            // See if there was a conflict
            if (error.response.status === 409)
                openCloseEmailPopup();
            
            // Otherwise just throw a generic one
            else
                openCloseGenericErrPopup();
        }
    }
    
    return (
        <div className="yellowBox smaller">
            {isEmailPopupOpen && <Popup
                content={<div>
                    <p className="popupHeader">Oops...</p>

                    <p className="popupText">That email is already registered</p>
                    <Link style={{textDecoration:"none"}} to="/login">
                        <button className="centeredButton"> Sign In instead?</button>
                    </Link>
                    <button className="centeredButton" onClick={openCloseEmailPopup}> No, let's have another look</button>
                </div>}
                handleClose={openCloseEmailPopup}
            />}
            {/* Just if there is a server error or something */}
            {isGenericErrPopupOpen && <Popup
                content={<div>
                    <p className="popupHeader">Oh no!</p>
                    <p className="popupText">Something went wrong</p>
                    <button className="centeredButton" onClick={handleSubmit}>Try again?</button>
                </div>}
                handleClose={openCloseGenericErrPopup}
            />}
            <form onSubmit={handleSubmit}>
                <label for="firstName">First name</label>
                <input className="textInput" type="text" id="firstName" name="firstName" onChange={handleChange} />
                <div id="error">
                    {isFilled.indexOf("firstName") >= 0 ? 
                    <p id="visible">First name is required</p> :
                    <p id="hidden">First name is required</p>}
                </div>
                <label for="lastName">Last name</label>
                <input className="textInput" type="text" id="lastName" name="lastName" onChange={handleChange} />
                <div id="error">
                    {isFilled.indexOf("lastName") >= 0 ? 
                    <p id="visible">Last name is required</p> :
                    <p id="hidden">Last name is required</p>}
                </div>

                <label for="email">Email</label>
                <input className="textInput" type="email" id="email" name="email" onChange={handleChange} /> 
                <div id="error">
                    {isFilled.indexOf("email") >= 0 ? 
                    <p id="visible">An email is required</p> :
                    <p id="hidden">An email is required</p>}
                </div>

                <label for="password">Password</label>
                <input className="textInput" type="password" id="password" name="password" onChange={handleChange} />
                <div id="error">
                    {isFilled.indexOf("password") >= 0 ? 
                    <p id="visible">A password is required</p> :
                    <p id="hidden">A password is required</p>}
                </div>
                <div id="error">
                    {formData.password && (formData.password.length < PASSWORD_MIN_LENGTH || !checkPasswordPolicy(formData.password)) ?
                    <p id="visible">
                        Make sure your password has:
                        <ul>
                            <li>At least {PASSWORD_MIN_LENGTH} characters long</li>
                            <li>At least one uppercase letter</li>
                            <li>And at least one number</li>
                        </ul>
                    </p> : 
                    <p id="hidden">
                        Make sure your password has:
                        <ul>
                            <li>At least {PASSWORD_MIN_LENGTH} characters long</li>
                            <li>At least one letter</li>
                            <li>And at least one number</li>
                        </ul>
                    </p>
                    }
                </div>
                <button type="submit" className="submitButton" onSubmit={handleSubmit}>Sign Up</button>
            </form>
            <p className="footnote">
                By signing up you agree to the <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Terms of Service</a>.
            </p>
        </div>
    );
}

export default CustomerSignUp;