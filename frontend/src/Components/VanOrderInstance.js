import { useState, useEffect } from "react";

import ReadyOrderButton from "./ReadyOrderButton";

const timeTilDiscount = 15;
const millisecondsInMinute = 60000;

const VanOrderInstance = (props) => {
    console.log(props.post);
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(props.post.date));
    // and a data structure to calc'ed the minutes and seconds

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(timeRemaining => timeRemaining-1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

   

    // function to change orders status to ready
    const markReady = async (orderid) =>{
        try {
        vendorAxios.get(`/order/vendor-change-status/${orderid}/READY`)
            .then(res => {
            console.log("Order ready!");
        })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    function getTimeRemaining() {
        let startTime = new Date(props.post.date);

        // get current time
        var curTime = new Date();

        // work out the time until the discount is
        // processed
        const endTime = new Date(startTime.getTime() + (timeTilDiscount * millisecondsInMinute));
        const diff = endTime - curTime;

        return(diff)
    }

    function displayTimeRemaining(time) {
        // get minutes and seconds seperate
        const remaining = {
            min: Math.floor(time / 60 / 1000),
            sec: Math.floor(time / 1000 % 60)
        }

        if (remaining[0] === '-') {
            return(<>
            <div className="vanOrderTimeRemaining red">{remaining.min}:{remaining.sec}</div>
            </>)
        }
        return(<>
            <div className="vanOrderTimeRemaining">{remaining.min}:{remaining.sec}</div>
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

    return (
        <div className="vanOrderContainer" key={props.post._id}>
            {displayModified(props.post)}
            {/* Mark ready button */}
            <ReadyOrderButton
                onClick={() => markReady(props.post._id)}
            />
            {/* The time remaining and order id */}
            <div className="orderHeaderGrid">
                <img src="/VanOrderIcons/TimerDark.svg" className="timerIcon" alt="Time" />
                {displayTimeRemaining(timeRemaining)}
            </div>
            <h1 className="vanOrderID">Order #{props.post._id}</h1>

            {/* The person's name */}
            <div className="vanOrderItemsContainer">
                <h1 className="vanOrderName">Name: {props.post.customer.firstName}</h1>
                
                {/* The items in the order */}
                {props.post.orderItems.map(orderItem =>(
                    <>{displayOrderItem(orderItem)}</>
                ))}
            </div>
        </div>
    );
}

export default VanOrderInstance;