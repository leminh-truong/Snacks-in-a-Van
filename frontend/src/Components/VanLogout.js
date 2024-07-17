import {React, useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import { vendorAxios } from '../Config';

import Loading from "./Loading";
import Popup from "./Popup";
import { deauthenticateVendor } from './Auth';

// This will be a dialog, ala from the Figma designs
function VanLogout(props) {
    const history = useHistory()
    // for the loading icon
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Upon loading, try closing the van
    useEffect(async () => {
        try {
            const res = await vendorAxios.post("/van/close", 
                {withCredentials: true});
            
            // close off the loading screen
            setIsLoading(false);
        
            // and for the outstanding orders
            if (res.data === "Outstanding orders")
                setError({
                    error: "Outstanding orders present",
                    message: "Please complete orders before relocating or logging out"
                });
            
            // Otherwise, just log out.
            else {
                deauthenticateVendor();
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
    }, []);

    return (
        <Popup
            content={
                <div>
                    {isLoading ? 
                        <Loading />
                        :
                        <>
                        {error && <div>
                            <img className="popupIcon" src="/Misc/cross.svg" />
                            <p className="popupHeader">{error.error}</p>
                            <p className="popupText">{error.message}</p>
                            <button className="centeredButton" onClick={props.handleClose}>Close</button>
                        </div>}
                        </>
                        
                    }
                </div>
            }
            noCloseButton={true}
        />
    );
}

export default VanLogout;