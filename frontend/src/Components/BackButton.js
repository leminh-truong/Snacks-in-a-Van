import React from "react";
import {useHistory} from "react-router-dom";

import "../styles/BackButton.scss";

// Just a plain old back button. Will fit in the upper left hand
// corner of a div or something
function BackButton(props) {
    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <img id="backButton" src="backButton.svg" onClick={goBack} alt="Back button"/>
    )
}

export default BackButton;