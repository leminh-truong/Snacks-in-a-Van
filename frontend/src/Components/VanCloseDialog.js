import { useHistory } from "react-router";
import { vendorAxios } from "../Config";

import Popup from "./Popup";
import ConfirmationButton from "./ConfirmationButton"

const VanCloseDialog = props => {
    const history = useHistory();

    const handleClose = async () => {
        // close, but without checking if there is any outstanding orders
        await vendorAxios.post("van/close", 
            {checkOutstanding: false}, {withCredentials: true});
        
        // and refresh the page
        history.go(0);
    }
    return (
        <Popup
            content={
                <div>
                    <img src="/VanMenuIcons/CloseLight.svg" alt="Closing sign" className="popupIcon" />
                    <p className="popupHeader">Are you sure?</p>
                    <p className="popupText">Closing your van will not allow any more orders to be placed.</p>
                    <ConfirmationButton 
                        confirmation={{
                            message: "OK, close van",
                            action: () => handleClose()
                        }}
                        return={{
                            message: "Cancel",
                            action: props.handleClose
                        }}
                    />
                </div>
            }
            handleClose={props.handleClose}
            noCloseButton={true}
        />
    )
}

export default VanCloseDialog; 