import { useEffect } from "react";
import { useHistory } from "react-router";
import { vendorAxios } from "../Config";

import Popup from "./Popup";
import Loading from "./Loading";
import { useState } from "react";

const VanRelocateDialog = props => {
    const history = useHistory();

    // Default to the loading screen while it has no data
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing
        const numbExisting = async () =>{ 
            vendorAxios.get("/van/number-outstanding", {withCredentials: true}); 
        }

        // And exit and show error if there is
        if (numbExisting.data > 0){
            // quit the loading screen, so the error is displayed
            setIsLoading(false)
        }
        // otherwise progress to the van open page
        else {
            history.push("/van/relocate")
        }
    }, [history]);

    return (
        <Popup 
            content={
                <div>
                    {isLoading ?
                         <Loading />
                         :
                         <div>
                             <img src="/VanMenuIcons/RelocateLight.svg" alt="Relocation icon" className="popupIcon" />
                             <p className="popupHeader">Error</p>
                             <p className="popupText">You cannot relocate while you have pending orders.</p>
                             <p className="popupText">Please complete all orders before relocating.</p>
                             <button className="centeredButton" onClick={props.handleClose}>Close</button>
                        </div>        
                    }
                </div>
            }
            handleClose={props.handleClose}
            noCloseButton={true}
        />
    )
}

export default VanRelocateDialog; 