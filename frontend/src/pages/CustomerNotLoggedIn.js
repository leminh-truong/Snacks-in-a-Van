import React from "react";

import "../styles/CustomerNotSignedIn.scss";
import BackButton from "../Components/BackButton";
import { useHistory } from "react-router-dom";

// Doing this intially as a seperate page (to allow for redirects, etc),
// but may be edited into a component so it will be a popup or something
function CustomerNotSignedIn() {
    // So that the page can be switched without reloading
    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }
    return (
        <div className="yellowBox">
            <BackButton />
            <img id="smallIcon" src="/icon.svg" alt="Logo"/><br/>
            <h3 id="title">You're not logged in</h3>
            <p id="nextActions">Log in or create an account so you can place an order!</p>
            <button className="centeredButton" onClick={() => routeChange(`/signup`)}>Create an Account</button>
            <p></p>
            <button className="centeredButton light" onClick={() => routeChange(`/login`)}>Log In</button>
            <p></p>
        </div>
    )
}

export default CustomerNotSignedIn;