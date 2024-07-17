import {useState} from "react";
import {useHistory, Link} from "react-router-dom";
import { vendorAxios } from "../Config";

import { authenticateVendor } from "../Components/Auth";
import "../styles/VanLogin.scss";

// Same as the user login
function VanLogin() {
    const [formData, setFormData] = useState({});
    const [errorStatus, setErrorStatus] = useState({hasError: false});

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value});
        console.log(formData)

        // And set the error status back to the original state, the user is trying
        // to fix it
        setErrorStatus({...errorStatus, hasError: false});
    }

    const handleSubmit = async (event) => {
        // To prevent the default redirection
        event.preventDefault();
        // Send off to API
        let data = await vendorAxios.post("/van/login", formData)
        .catch((err) => {
            setErrorStatus({hasError: true, error: "Server error, Please try again"})
        });

        if (data.data === "Invalid username or password"){
            // the error status and stop
            setErrorStatus({hasError: true, error: "Wrong van name or password"});
            return;
        }

        // And sign the user in if indeed the token is returned
        if (data !== undefined){
            // Save the token
            authenticateVendor(data.data);

            // And send the user to the home page
            routeChange(`/van/menu`);
        }
    }

    return (
        <div className="yellowBox">
            <form onSubmit={handleSubmit}>
                <label for="name">Van name</label>
                <input className="textInput" type="text" id="name" name="name" onChange={handleChange} />
                <label for="password">Password</label>
                <input className="textInput" type="password" id="password" name="password" onChange={handleChange} />

                <button type="submit" className="submitButton" onSubmit={handleSubmit}>Sign In</button>
            </form>
            <br />
            <div id="error">
                {errorStatus.hasError ? <p id="visible">
                    {errorStatus.error} <br />
                    Looking for the <Link to={"/login"}>user login</Link>?
                    </p> : <p id="hidden">{errorStatus.error} <br />
                    Looking for the <Link to={"/login"}>user login</Link>?</p>}
            </div>
        </div>
    );
}

export default VanLogin;