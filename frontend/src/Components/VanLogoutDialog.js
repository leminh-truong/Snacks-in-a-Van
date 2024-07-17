import { React, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { vendorAxios } from '../Config';

import Loading from "./Loading";
import Popup from "./Popup";
import { deauthenticateUser } from './Auth';
import ConfirmationButton from './ConfirmationButton';

// This will be a dialog, ala from the Figma designs
function VanLogoutDialog(props) {
    const history = useHistory()
    // for the loading icon
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleLogout = async () => {
        try {
            // the user has confirmed, progress to logout
            setIsConfirmed(true);
            // Close the van
            const res = await vendorAxios.post("/van/close", 
                {checkOutstanding: true}, {withCredentials: true});
            
            // close off the loading screen
            setIsLoading(false);
        
            // and check for the outstanding orders
            if (res.data === "Outstanding orders")
                setError({
                    error: "Outstanding orders present",
                    message: "Please complete orders before relocating or logging out"
                });

            
            // Otherwise, just log out (i.e. removing the token)
            else {
                deauthenticateUser();
                // and redirect them home
                history.push("/")
            }
        }
        catch (err) {
            setError({
                error: "Server error", 
                message: "Please try again"
            });
        }
    }

    return (
        <Popup
            content={
                <div>
                    {!isConfirmed ? 
                        <div>
                            <img className="popupIcon" src="/VanMenuIcons/LogoutLight.svg" alt="Logout icon" />
                            <p className="popupHeader">Are you sure you want to log out?</p>
                            <ConfirmationButton
                                confirmation={{
                                    message: "Yes, Log Out",
                                    action: () => handleLogout()
                                }}
                                return={{
                                    message: "No, stay",
                                    action: props.handleClose
                                }}
                            />
                        </div>
                        :
                        <>
                            {isLoading ? 
                            <Loading />
                            :
                            <>
                            {error && <div>
                                <img className="popupIcon" src="/VanMenuIcons/CrossLight.svg" alt="Cross Icon"/>
                                <p className="popupHeader">{error.error}</p>
                                <p className="popupText">{error.message}</p>
                                <button className="centeredButton" onClick={props.handleClose}>Close</button>
                        </div>}
                        </>
                        
                    }
                        </>
                    }
                </div>
            }
            noCloseButton={true}
        />
    );
}

export default VanLogoutDialog;