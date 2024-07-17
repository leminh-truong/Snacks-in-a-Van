import {React, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { vendorAxios } from "../Config";

import "../styles/VanOpen.scss";
import Loading from "../Components/Loading";
import Popup from "../Components/Popup";
import {SubmissionMap} from "../Components/Map";

function VanOpen() {
    const [isVanOpenDialog, setIsVanOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkIfVanOpen();
    }, []);
    
    const history = useHistory();

    const checkIfVanOpen = async () => {
        var vanOpen = false;
        try {
            const res = await vendorAxios.get("/van/info", 
                {withCredentials: true});

            vanOpen = res.data.isOpen;
            setIsLoading(false);
        }
        catch (err) {
            console.error(err);
        }

        if (vanOpen) {
            // open the van open dialog
            setIsVanOpenDialog(true);
        }
    }

    return (
        <>
        {isLoading ? <Loading /> :
            <div>
                <p className="welcome">Open Van</p>
                <h1 className="welcomeTitle">Let's pick where you'll be today</h1>
                <p id="wec">Move the map to your van's location and give it a short description so customers can find you easily.</p>
                <div id="map" className="map-container">
                <SubmissionMap 
                    submission={{
                        prompt: "Where are you today?",
                        placeholder: "Opposite Stop One",
                        link: "/van/open",
                        redirect: "/van/menu",
                        axios: vendorAxios
                    }}
                />
                <br />
                </div>
                {isVanOpenDialog && <Popup noCloseButton={true} content={
                    <div>
                        <img src="/VanMenuIcons/OpenLight.svg" alt="Open icon" className="popupIcon" />
                        <p className="popupHeader">You're already open!</p>
                        <p className="popupText">You need to close or relocate before you can open again.</p>
                        <button className="centeredButton" onClick={() => history.push("/van/menu")}>Back to menu</button>
                    </div>
                } /> }
            </div>
        }
        </>
    )
}

export default VanOpen;