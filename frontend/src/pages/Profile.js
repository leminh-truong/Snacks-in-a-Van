import {React, useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import {Link} from 'react-router-dom';
import { checkPasswordPolicy } from '../Components/Auth';

import { customerAxios } from '../Config';

import '../styles/Profile.scss';
import '../styles/CustomerSignUp.scss';
import Loading from "../Components/Loading";
import Popup from '../Components/Popup.js';


function Profile() {
    const PASSWORD_MIN_LENGTH = 6;
    const REQ_INPUTS = ["firstName", "lastName", "email", "password"];
    
    const [formData, setFormData] = useState({});
    const [userProfile, setUserProfile] = useState(null);
    const [isNamePopupOpen,setIsNamePopupOpen] = useState(false);
    const [isPasswordPopupOpen,setIsPasswordPopupOpen] = useState(false);
    // To check the status of the filling of each box
    const [isFilled, setIsFilled] = useState([]);
    
    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    const setNamePopup = () => {
        setIsNamePopupOpen(!isNamePopupOpen);
    }

    const setPasswordPopup = () => {
        setIsPasswordPopupOpen(!isPasswordPopupOpen);
    }

    const fetchUserInfo = async () => {
        // Fetch the information about the user
        // 
        customerAxios.get("/user/info").then(res => {
            //const data = res.data;
            setUserProfile(res.data);
        }).catch(err => {
            console.error(err);
        })

    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

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

    function checkMatching(formData) {
        if (formData.password !== formData.password1)
            return false;
        return true;
    }

    function checkValidNameExists(formData) {
        if (formData.firstName == null || formData.lastName == null)
            return false;
        if (formData.firstName.length < 1 || formData.lastName.length < 1)
            return false;
        return true;
    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // submit to the DB
        try {
            // Prevent the default reloading of page
            event.preventDefault();
            // Check if filled
            if (!checkValidNameExists(formData)) {
                alert("You cannot save, the data is invalid! :(");
                return;
            }
            
            await customerAxios.get(`/user/change-firstname/${formData.firstName}`);
            await customerAxios.get(`/user/change-lastName/${formData.lastName}`);

            setNamePopup();
            window.location.reload();
        }
        catch (error) {
        }
    }

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        // submit to the DB
        try {
            // Prevent the default reloading of page
            event.preventDefault();
            // Check if filled
            if (checkFilled() || checkPasswordPolicy(formData.password) 
                || checkMatching(formData) || formData.password == null) {
                alert("You cannot save, the data is invalid! :(");
                return;
            }
            
            await customerAxios.get(`/user/change-password/${formData.password}`);

            setPasswordPopup();
            window.location.reload();
        }
        catch (error) {
        }
    }

    function editPasswordPopup() {
        return (
            <>
            {isPasswordPopupOpen && <Popup content={
                <>
                <img src ="../../edit.svg" className="editImage" alt="edit"></img>
                <p></p>

                {/* enter password label */}
                <label htmlFor="password">Enter a new password:</label>
                <input className="textInput" type="password" id="password" name="password" onChange={handleChange}/>
                
                {/* confirm password label */}
                <label htmlFor="password1">Confirm password:</label>
                <input className="textInput" type="password" id="password1" name="password1" onChange={handleChange}/>
                
                {/* password not existing error*/}
                <div id="error">
                    {isFilled.indexOf("password") >= 0 ? 
                    <p id="visible">A password is required</p> :
                    <p id="hidden">A password is required</p>}
                </div>

                {/* password matching error*/}
                <div id="error">
                    {!checkMatching(formData) ? 
                    <p id="visible">Passwords must match</p> :
                    <p id="hidden">Passwords must match</p>}
                </div>

                {/* password compliance error */}
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
                <button type="submit" className="centeredButton" onClick={handleSubmit1}>Save Changes</button>
                </>
            }handleClose={setPasswordPopup}/>}

        </>)
    }

    function editNamePopup() {
        return (<>
            {/* edit name popup */}
            {isNamePopupOpen && <Popup content={
            <>
            <img src ="../../edit.svg" className="editImage" alt="edit"></img>
            <p></p>

            {/* edit first name */}
            <label htmlFor="firstName">Enter a new first name:</label>
            <input className="textInput" type="text" id="firstName" name="firstName" onChange={handleChange} />
            <div id="error">
                {formData.firstName != null && formData.firstName.length < 1 ? 
                <p id="visible">New first name is required</p> :
                <p id="hidden">New first name is required</p>}
            </div>

            {/* edit last name */}
            <label htmlFor="lastName">Enter a new last name:</label>
            <input className="textInput" type="text" id="lastName" name="lastName" onChange={handleChange} />
            <div id="error">
                {formData.lastName != null && formData.lastName.length < 1 ? 
                <p id="visible">New last name is required</p> :
                <p id="hidden">New last name is required</p>}
            </div>
            <button type="submit" className="centeredButton" onClick={handleSubmit}>Save Changes</button>
            </>
            }handleClose={setNamePopup}/>}
        </>)
    }

    return (
        <>
        {userProfile ?
            <>
            <p className="menuTitle">My account</p>
            <div className="yellowBox">
                <div className="emailGrid">
                    <p className="title">Email:</p>
                    <p className="content">{userProfile.email}</p>
                </div>
                <div className="nameGrid">
                    <button className="edit" onClick ={() => setNamePopup()}>
                        <img src="../../edit.svg" alt="edit"></img>
                    </button>
                    <p className="title">Name:</p>
                    <p className="content">{userProfile.firstName} {userProfile.lastName}</p>
                </div>
                <div className="passGrid">
                    <button className="edit" onClick ={() => setPasswordPopup()}>
                        <img src="../../edit.svg" alt="edit"></img>
                    </button>
                    <p className="title">Password:</p>
                    <p className="content">•••••••</p>
                </div>

                {editNamePopup()}

                {editPasswordPopup()}
                

                <Link style={{textDecoration:"none"}}to="/order">
                    <button className="centeredButton light"><img className="buttonIcon" width="15px" src="/BagIcon.svg" title="View account" alt="Account icon"/>View My Orders</button>
                </Link>
                <p></p>
                <button className="centeredButton" onClick={() => routeChange(`logout`)}>Logout</button>
            </div></> : <Loading /> }
        </>
    )
}

export default Profile;