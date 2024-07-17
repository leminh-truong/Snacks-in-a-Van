import {React, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import '../styles/Order.scss';
import '../styles/Popup.scss';
import { customerAxios } from '../Config';
import Loading from "../Components/Loading";
import Popup from '../Components/Popup.js';
import 'bootstrap/dist/css/bootstrap.min.css'

const allowedEditTime = 10; // minutes
const timeTilDiscount = 15; // minutes

function ViewOneOrder({order_id}) {
    const [order,setOrder]=useState(null);
    const [isEditPopupOpen,setIsEditPopupOpen] = useState(false);
    const [isCancelPopupOpen,setIsCancelPopupOpen] = useState(false);
    //var [isLatePopupOpen, setIsLatePopupOpen] = useState(false);

    const openEditPopup = () => {
        if (order.date) {
            if (isTimeRemaining(order.date)) {
                setIsEditPopupOpen(!isEditPopupOpen);
            }
            else {
                alert("The time window to edit your order has passed! Sorry, but you can no longer edit or cancel your order");
            }
        }
    }

    const closeEditPopup = () => {
        setIsEditPopupOpen(!isEditPopupOpen);
    }

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    // when user edits the order
    const editPopup = () => {
        try {
            // set status to pending
            customerAxios.get(`/order/customer-change-status/${order._id}/PENDING`)
            .then(res => {
                // set isModified to true
                customerAxios.get(`/order/modify/${order._id}`)
                .then(res => {
                    console.log(order);
                    // and redirect the user to the menu page
                    routeChange(`/menu/${order.van._id}`);
                })
            })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    const openCancelPopup = () => {
        if (order.date) {
            if (isTimeRemaining(order.date)) {
                setIsCancelPopupOpen(!isCancelPopupOpen);
            }
            else {
                alert("The time window to edit your order has passed! Sorry, but you can no longer edit or cancel your order");
            }
        }
    }
    const closeCancelPopup = () => {
        setIsCancelPopupOpen(!isCancelPopupOpen);
    }
    const cancelPopup = () => {
        try {
            customerAxios.get(`/order/customer-change-status/${order_id}/CANCELLED`)
            .then(res => {
                // and redirect the user to the order status page
                routeChange(`/order`);
            })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    /*const openLatePopup = () => {
        setIsLatePopupOpen(!isLatePopupOpen);
    }
    const closeLatePopup = () => {
        setIsLatePopupOpen(!isLatePopupOpen);
    }*/

    useEffect(()=>{
        let mounted = true;
        // function to fetch a van using vanid from the backend
        const fetchOrders=async () =>{
            try {
            customerAxios.get(`/order/get/${order_id}`)
                .then(res => {
                    const orderData = res.data;
                    setOrder(orderData);
                })
            }
            catch (err) {
                console.error(err.response.status);
            }
        }
        if (mounted)
            fetchOrders();
        return () => mounted = false;
    },[order_id]);

    // function to get the price formatted correctly out the database
    function getFloat(value) {
        return value && value['$numberDecimal'] ? value['$numberDecimal'] : 0;
    }

    // formats date from datetime in the database
    function formatDate(value) {
        var year = value.slice(0, 4);
        var month = value.slice(5,7);
        var day = value.slice(8,10)
        return day + "/" + month + "/" + year;
    }

    // formats time from datetime in the database
    function formatTime(value) {
        
        // convert to local timezone from UTC
        value = new Date(value);

        // convert to 12 hr time
        return convertTo12hrTime(value);
    }

    // returns time as a string in 12 hr time
    // part of function taken from 
    //https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no#:~:text='AM'%20%3A%20'PM',it%20into%20its%20component%20parts.
    function convertTo12hrTime(date) {
        // get the time as a string
        var hrString = ("00" + date.getHours()).slice (-2);
        var minString = ("00" + date.getMinutes()).slice (-2);
        var time = hrString + ":" + minString;

        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];

        // Convert 24 hr time to 12 hr time
        if (time.length > 1) { // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }

        return time.join('');
    }

    // convert status to more appropriate lower case format
    function formatStatus(value) {
        if (value === "OUTSTANDING")
            return "In progress"
        var status = value.toLowerCase();
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    // function to get total price of the order
    function getTotal(value) {
        var total = 0, i;
        for (i = 0; i < value.length; i++) {
            total += value[i].qty * getFloat(value[i].itemID.price);
        }
        return total;
    }

    function displayTotal(post) {
        var total = getTotal(post.orderItems);
        if (post.discount > 0) {
            return (<>
            <p className="orderItemTotal"><strike>Total: ${total.toFixed(2)}</strike></p>
            <p className="orderItemTotal">Total: ${(total * (1 - post.discount)).toFixed(2)}</p>
            </>)
        }
        return (<><p className="orderItemTotal">Total: ${total.toFixed(2)}</p></>)
    }
    
    // function to calculate the time when the order is ready using datetimes from the database
    function getReadyTimePrediction(value) {
        value = new Date(value);
        var newDate = new Date(value.getTime() + timeTilDiscount*60000);
        return convertTo12hrTime(newDate);
    }

    // checks time difference in seconds between start and current time and returns bool
    function isTimeRemaining(startTime) {
        startTime = new Date(startTime);
        // get current time
        var curTime = new Date();

        // get time difference in seconds
        const diff = (curTime - startTime) / 1000;
        if (diff >= allowedEditTime*60) {
            return false;
        }
        return true;
    }

    // function to return display for an individual item in the order
    function returnObjects(post){
        if (post.qty){
            return (
                <div className="orderGridCont">
                    <div>
                        <p className="orderItemTitle">{post.itemID.name}</p>   
                    </div>
                    <div>
                        <p className="orderItemPrice">${getFloat(post.itemID.price)} x{post.qty}</p>
                    </div>
                    <div>
                        <p className="orderItemQty">${getFloat(post.itemID.price) * post.qty * 1.00}</p>
                    </div>
                </div>
                );
        } else {
            return;
        }
    }

    // For some reason the database doesn't update in time by the time the
    // user gets to this page
    function ifOustanding(value){
        if (value === "OUTSTANDING" || value === "PENDING"){
            return (
                <>
                <div className="centeredBlock">
                <h2 className="outstanding">Your order's been placed!</h2>
                {order.date&&(<h2 className="orderReadyText">It should be ready by <span className="orderReadyTime">{getReadyTimePrediction(order.date)}</span></h2>)}
                
                {/* cancel button */}
                <button className="timeBackground" onClick={() => openCancelPopup()}>
                    <img src ="../../bin.svg" alt="Back"></img>
                </button>

                {/* edit button */}
                <button className="timeBackground" onClick={() => openEditPopup()}>
                    <img src ="../../edit.svg" style={{width:"25px"}} alt="Edit"></img>
                </button>
                </div>

                {/* cancel button popup */}
                {isCancelPopupOpen && <Popup content={
                    <>
                    <img src ="../../bin.svg" className="editImage" alt="Bin"></img>
                    <p className="popupText"> Are you sure you want to cancel the order?<br></br>This cannot be undone.</p>
                    <p className="popupText"></p>
                    <button className="centeredButton" onClick={() => cancelPopup()}>Cancel Order</button>
                    </>
                }handleClose={closeCancelPopup}/>}

                {/* edit button popup */}
                {isEditPopupOpen && <Popup content={
                    <>
                    <img src ="../../edit.svg" className="editImage" alt="Edit"></img>
                    <p className="popupText"> Are you sure you want to edit the order?</p>
                    <p className="popupText"></p>
                    <button className="centeredButton" onClick={() => editPopup()}>Edit Order</button>
                    </>
                }handleClose={closeEditPopup}/>}

                {/*isLatePopupOpen && <Popup content={
                <div id="timeup">
                <img src ="../../clock.svg" className="editImage" alt="Clock"></img>
                <p className="popupHeader"> We're sorry</p>
                <p className="popupText">{order.van} has not prepared your order in time.</p>
                <p className="popupText">A 20% discount has been applied to the order.</p>
                </div>
                }handleClose={closeLatePopup}/>*/}
                </>
                );
        } else {
            return;
        }
    }

    function outstandingText(value) {
        if (value === "OUTSTANDING" || value === "PENDING"){
            return (
                <>
                <div>
                    <p className="editCaption">You can change or cancel your order anytime within {allowedEditTime} minutes of placing your order.</p>
                </div>
                </>
            );
        } else {
            return;
        }
    }
    function completedDate(order) {
        if (order.status && (order.status === "COMPLETED" || order.status === "READY")){
            return (
                <>
                {order.dateReady &&(<h3 className="orderDateTime">Completed on: {formatDate(order.dateReady)} {formatTime(order.dateReady)}</h3>)}
                </>
            );
        } else {
            return;
        }
    }

    return (
        <div>
            {order&&order.status&&(ifOustanding(order.status))}
            {order ? (
                <div className="orderBackground">
                <h3 className="orderStatus">Order #{order._id}</h3>
                {order.status && (<h2 className="orderStatus">Status: {formatStatus(order.status)}</h2>)}
                {order.van && (<h2 className="orderStatus">Van: {order.van.name}</h2>)}
                {order.date &&(<h2 className="orderDateTime">Placed on: {formatDate(order.date)} {formatTime(order.date)}</h2>)}
                {completedDate(order)}
                <p></p>
                <h1 className="orderID">Summary:</h1>

                {order.orderItems&&(<div>
                    {order.orderItems.map(post =>(
                        <div key={post._id}>{returnObjects(post)}</div>
                    ))}
                </div>
                )}
                <div>
                    {order.orderItems && displayTotal(order)}
                </div> 
                {order&&order.status&&(outstandingText(order.status))}
                </div>
            ) : <Loading />}
            <button className="centeredButton" onClick={() => routeChange(`/order`)}>Back to Order History</button>
        </div>
    )
}

export default ViewOneOrder;