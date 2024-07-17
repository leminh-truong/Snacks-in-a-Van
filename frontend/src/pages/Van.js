import {React, useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import '../styles/Van.scss';
import { vendorAxios } from '../Config';
import VanMenuButton from '../Components/VanMenuButton.js';

import 'bootstrap/dist/css/bootstrap.min.css'
import VanLogoutDialog from '../Components/VanLogoutDialog';
import VanCloseDialog from "../Components/VanCloseDialog";
import VanRelocateDialog from "../Components/VanRelocateDialog";
import Loading from '../Components/Loading';

function Van({vanid}) {
    const [van,setVan]=useState(false);

    // and the booleans for the various popups
    const [logoutDialog, setLogoutDialog] = useState(false);
    const [closeDialog, setCloseDialog] = useState(false);
    const [relocateDialog, setRelocateDialog] = useState(false);

    useEffect(()=>{
        // function to fetch a van's info from the backend
        const fetchVan=async () =>{
            try {
            vendorAxios.get(`/van/info`,
                {withCredentials: true}
            ).then(res => {
                const vanData = res.data;
                setVan(vanData);
            })
            }
            catch (err) {
                console.error(err.response.status);
            }
        }
        fetchVan();
    },[vanid]);
    
    function vanStatus() {
        if (van.isOpen) {
            return (<>
            <img src="/VanMenuIcons/Open.svg" className="vanStatusIcon" alt="Open"></img>
            <h1 className="vanStatus">Van is open and ready for orders</h1>
            </>);
        }
        return (<>
            <img src="/VanMenuIcons/Closed.svg" className="vanStatusIcon" alt="Closed"></img>
            <h1 className="vanStatus">Van is currently closed</h1>
            </>);
    }

    function setVanStatusButton() {
        if (van.isOpen) {
            return (<VanMenuButton content={<>Close Van</>}
                handleClick={() => setCloseDialog(true)}
                className={"vanMenuButtonBox five"}
                imgName={"/VanMenuIcons/CloseLight.svg"}
            />)
        }
        return (<VanMenuButton content={<>Open Van</>}
                handleClick={handleOpenButton}
                className={"vanMenuButtonBox five"}
                imgName={"/VanMenuIcons/OpenLight.svg"}
            />)
    }

    const history = useHistory();
    const handleNewOrderButton = () => {
        history.push(`/van/outstanding-orders`);
    }

    const handleOrderHistory =  () => {
        history.push(`/van/order-history`);
    }

    const handleReadyOrder = () => {
        history.push(`/van/ready-orders`);
    }

    
    const handleOpenButton = () => {
        history.push(`/van/open`);
    }

    const handleRelocateButton = () => {
        setRelocateDialog(true);
    }
    
    return (
        <div className="yellowBackground">
            {van ?
                <>
                    <h1 className="vanTitle"> {van.name} </h1>
                    {vanStatus()}
                    <div className="vanMenuButtonGrid">
                        <VanMenuButton content={<>New Orders</>}
                            handleClick={handleNewOrderButton}
                            className={"vanMenuButtonBox one"}
                            imgName={"/VanMenuIcons/NewOrder.svg"}
                        />
                        <VanMenuButton content={<>Uncollected Orders</>}
                            handleClick={handleReadyOrder}
                            className={"vanMenuButtonBox two"}
                            imgName={"/VanMenuIcons/Bag.svg"}
                        />
                        <VanMenuButton content={<>Order History</>}
                            handleClick={handleOrderHistory}
                            className={"vanMenuButtonBox three"}
                            imgName={"/VanMenuIcons/OrderHistory.svg"}
                        />
                        {/* Only display the redirect option if the van is open */}
                        {van.isOpen &&
                            <VanMenuButton content={<>Relocate</>}
                                handleClick={handleRelocateButton}
                                className={"vanMenuButtonBox four"}
                                imgName={"/VanMenuIcons/Relocate.svg"}
                            />
                        }
                        {relocateDialog && <VanRelocateDialog handleClose={() => setRelocateDialog(false)} />}
                            {setVanStatusButton()}
                            {closeDialog && <VanCloseDialog handleClose={() => setCloseDialog(false)}/>}
                            <VanMenuButton content={<>Logout</>}
                                handleClick={() => setLogoutDialog(true)}
                                className={"vanMenuButtonBox six"}
                                imgName={"/VanMenuIcons/LogoutLight.svg"}
                            />
                            {logoutDialog && <VanLogoutDialog handleClose={() => setLogoutDialog(false)} />}
                    </div>
                </>
                :
                <Loading />
            }
        </div>
    )
}

export default Van;