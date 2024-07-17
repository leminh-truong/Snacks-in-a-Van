import {React, useState, useEffect} from 'react'
//import { Link, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/Orders.scss';
import '../styles/Grey.scss';
import Loading from '../Components/Loading'
import { customerAxios } from '../Config';
//import {isAuthenticated} from "../Components/Auth";
import 'bootstrap/dist/css/bootstrap.min.css'

function ViewOrderHistory() {
    const [orders,setItems]=useState(null);
    //const [userProfile, setUserProfile] = useState(null);

    useEffect(()=>{
        // Fetch the information about the user and call fetchOrders afterwards
        const fetchUserInfo = async () => {
            customerAxios.get("user/info").then(res => {
                fetchOrders(res.data._id);
            }).catch(err => {
                console.error(err);
            })
        }
        fetchUserInfo();
    },[]);

    

    // Get orders by user from database 
    const fetchOrders = async (id) =>{
        if (id != null) {
            customerAxios.get(`/user/getorders/${id}`).then(res => {
                const ordersdata = res.data;
                setItems( ordersdata);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.log("Null user!");
        }
    }

    // function to format date in a nicer way
    function formatDate(value) {
        var year = value.slice(2, 4);
        var month = value.slice(5,7);
        var day = value.slice(8,10)
        return day + "/" + month + "/" + year;
    }

    // part of function taken from 
    //https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no#:~:text='AM'%20%3A%20'PM',it%20into%20its%20component%20parts.
    function formatTime(value) {
        var time = value.slice(11, 16)

        // adjust for timezone
        var hr = parseInt(value.slice(11, 13));
        hr += 10;
        hr = hr % 24;
        var hrString = hr.toString();
        if (hrString.length === 1) {
            time = "0" + hrString + time.slice(2, 6);
        }
        else if (hrString.length === 2) {
            time = hrString + time.slice(2, 6);
        }
        
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
        
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
        return status.charAt(0).toUpperCase() + status.slice(1);;
    }

    // changes the background color of the order to indicate status
    var backgroundStyle = function(options) {
        if (options === "OUTSTANDING")
            return "orderGridContainer orange"
        else if (options === "READY")
            return "orderGridContainer green"
        else if (options === "COMPLETED" || options === "PENDING")
            return "orderGridContainer grey"
        else
            return "orderGridContainer"
    }

    // screen to display the order history
    function displayOrders() {
        return (
            <>
            <h1 className="menuTitle">Your Orders</h1>
            <div className="ordersGrid">
            {orders&&(<>
            {orders.map(post =>(
                <div key={post._id}>
                    <div className={backgroundStyle(post.status)}>
                        <p className="orderText">{formatDate(post.date)} </p>
                        <p className="orderText">{formatTime(post.date)} </p>
                        <p className="orderText">{formatStatus(post.status)}</p>
                    </div>

                    <Link to={`/order/get/${post._id}`}>
                        <p className="orderLink">View order details</p>
                    </Link>
                </div>
            ))}
            </>
            )}
            </div>
            </>
        )
    }

    // screen to tell the customer they have no orders yet
    function displayNoOrders() {
        return (
            <>
            <img className="greyFilter" width="70px"src="/VanFull.svg" alt="Logo"/>
            <p></p>
            <h1 className="greyText">Hmm, looks like you haven't ordered anything yet! :(</h1>
            <Link style={{textDecoration:"none"}} to={`/customer/select-van`}><h1 className="greyText">Click here to make an order</h1></Link>
            </>
        )
    }

    // choose which screen to display
    function display() {
        if (!orders) {
            return <Loading />
        }
        // When there is no orders
        if (orders && orders.length === 0) {
            return displayNoOrders();
        } else {
            return displayOrders();
        }
    }
    return (
        <>{display()}</>
    )
}
  
export default ViewOrderHistory;