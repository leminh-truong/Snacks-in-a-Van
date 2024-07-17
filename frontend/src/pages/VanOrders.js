import {React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../styles/VanOrders.scss';
import '../styles/Van.scss';
import { vendorAxios } from '../Config';
import Loading from '../Components/Loading';
import ReadyOrderButton from '../Components/ReadyOrderButton';

const timeTilDiscount = 15;

function VanOrders({vanid}) {
    const [orders,setOrders]=useState([]);
    useEffect(()=>{
        let mounted = true;

        // function to fetch a van using vanid from the backend
        const fetchItem=async () =>{
            try {
            vendorAxios.get(`/van/outstanding-orders`)
                .then(res => {
                const itemsdata = res.data;
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
    },[vanid]);

    // function to change orders status to ready
    const markReady = async (orderid) =>{
        try {
        vendorAxios.get(`/order/vendor-change-status/${orderid}/READY`)
            .then(res => {
            setOrders(orders.filter(item => item._id !== orderid));
        })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    // function to apply a discount to an order
    const applyDiscount = async (orderid) =>{
        try {
        vendorAxios.get(`/order/discount/${orderid}`)
            .then(res => {
            //setOrders(orders.filter(item => item._id !== orderid));
        })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    function displayDiscount(post) {
        if (getTimeRemaining(post.date)[0] === '-') {
            applyDiscount(post._id);
            return (<><div className="modifiedBackground">
                <h1 className="modifiedText">Discounted</h1>
            </div></>)
        }
        return (<></>)
    }

    function getTimeRemaining(startTime) {
        startTime = new Date(startTime);

        // get current time
        var curTime = new Date();

        // get time difference in seconds
        const diff = (curTime - startTime) / 1000;
        
        // get minutes and seconds seperate
        var min = Math.floor(diff / 60);
        var sec = Math.floor(diff / 60 % 60);

        // convert to time remaining
        min = timeTilDiscount - min - 1;
        sec = 59 - sec;
        return min + ":" + sec;
    }

    // screen to tell the customer they have no orders yet
    function displayNoOrders() {
        return (
            <>
            <div className="yellowBackground">
            <img className="noOrderIcon" width="70px"src="/VanOrderIcons/Waiting.svg" alt="Logo"/>
            <p></p>
            <h1 className="noOrderText">There are no orders for your van...yet</h1>
            </div>
            </>
        )
    }

    function displayTimeRemaining(post) {
        var remaining = getTimeRemaining(post.date);
        if (remaining[0] === '-') {
            return(<>
            <div className="vanOrderTimeRemaining red">{getTimeRemaining(post.date)}</div>
            </>)
        }
        return(<>
            <div className="vanOrderTimeRemaining">{getTimeRemaining(post.date)}</div>
        </>)
    }
    function displayModified(post) {
        if (post.isOrderModified) {
            return (<><div className="modifiedBackground">
                <h1 className="modifiedText">MODIFIED</h1>
            </div></>)
        }
        return (<></>)
    }
    
    function displayOrders() {
        return (
            <>
            <div className="yellowBackground">
            <div style={{padding:"5vh"}}>
            <h1 className="menuTitle" style={{textAlign:"center"}}>Outstanding orders</h1>
            {orders&&(
                <div className="vanOrdersGrid">
                {orders.map(post =>(
                <div key={post._id}>
                <div className="vanOrderContainer" key={post._id}>
                    {displayModified(post)}
                    {displayDiscount(post)}
                    {/* Mark ready button */}
                    <ReadyOrderButton
                        onClick={() => markReady(post._id)}
                    />
                    {/* The time remaining and order id */}
                    <div className="orderHeaderGrid">
                    <img src="/VanOrderIcons/TimerDark.svg" className="timerIcon" alt="Time"></img>
                    {displayTimeRemaining(post)}
                    </div>
                    <h1 className="vanOrderID">Order #{post._id}</h1>
    
                    {/* The person's name */}
                    <div className="vanOrderItemsContainer">
                    <h1 className="vanOrderName">Name: {post.customer.firstName}</h1>
                    
                    {/* The items in the order */}
                    {post.orderItems.map(orderItem =>(
                        <><div key={orderItem._id}>{displayOrderItem(orderItem)}</div></>
                    ))}
                    </div>
                </div>
                </div>
                ))}
                </div>
            )}
            <Link to={`/van/menu`}>
                <p className="orderBack">back</p>
            </Link>
            </div>
            </div>
            </>
        )
    }

    function displayOrderItem(orderItem) {
        if (orderItem.qty > 0) {
            return (<>
            <div key={orderItem._id} className="vanOrderItemGrid">
                {/* The order item name and qty*/}
                <div><h1 className="orderItemTitle">{orderItem.itemID.name}</h1></div>
                <div><h1 className="orderItemTitle">x{orderItem.qty}</h1></div>
            </div>
            </>)
        }
        return (<></>)
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

export default VanOrders;