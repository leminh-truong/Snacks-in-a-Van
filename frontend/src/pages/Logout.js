import {React, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import {deauthenticateUser} from "../Components/Auth";
import "../styles/Login.scss";

function Logout() {
    const handleLogout = () => {
        deauthenticateUser();
    }

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    useEffect(() => {
        handleLogout();
    });

    return (
        <div className="yellowBox hero">
            <h2 className="logoutTitle">We've logged you out</h2>
            <p className="byline">
                Thanks for snacking with us!
            </p>
            <button className="centeredButton" onClick={() => routeChange(`/login`)}>Log back in</button>
        </div>
    );
}

export default Logout;