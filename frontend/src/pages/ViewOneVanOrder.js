import {React, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import '../styles/Order.scss';
import '../styles/Popup.scss';
import { vendorAxios } from '../Config';
import Loading from "../Components/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewOneVanOrder({vanid, orderid}) {
    const [order,setOrders]=useState([]);
    useEffect(()=>{
        let mounted = true;

        // function to fetch ready orders of a van using vanid from the backend
        const fetchItem=async () =>{
            try {
            vendorAxios.get(`/van/order-history/${orderid}`)
                .then(res => {
                const itemsdata = res.data;
                console.log(itemsdata);
                setOrders(itemsdata);
            })
            }
            catch (err) {
                console.error(err.response.status);
            }
        }
        if (mounted)
            fetchItem();
        return () => mounted = false;
    },[vanid, orderid]);

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

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

    // function to return display for an individual item in the order
    function returnObjects(post){
        if (post.qty){
            return (
                <div className="orderGridCont">
                    <div>
                        <p className="orderItemTitle">{post.itemID.name}</p>   
                    </div>
                    <div>
                        <p className="orderItemPrice">${getFloat(post.itemID.price)} x {post.qty}</p>
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
            {order ? (
                <div className="orderBackground">
                <h3 className="orderID">Order #{order._id}</h3>
                {order.status && (<h2 className="orderStatus">Status: {formatStatus(order.status)}</h2>)}
                {order.van && (<h2 className="orderStatus">Van: {order.van.name}</h2>)}
                {order.customer && (<h2 className="orderStatus">Customer: {order.customer.firstName} {order.customer.lastName}</h2>)}
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
                </div>
            ) : <Loading />}
            <button className="centeredButton" onClick={() => routeChange(`/van/${vanid}/order-history`)}>Back to Order History</button>
        </div>
    )

}

export default ViewOneVanOrder;