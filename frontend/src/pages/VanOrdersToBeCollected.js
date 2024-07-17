import {React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../styles/VanOrders.scss';
import '../styles/Van.scss';
import '../styles/Orders.scss';
import { vendorAxios } from '../Config';
import Loading from '../Components/Loading';
import ReadyOrderButton from '../Components/ReadyOrderButton';

// The dependency "react-collapsibe" is an open-source 
// project authored by Glenn Flanagan. Informaion 
// about this dependecy can be found at:
// https://github.com/glennflanagan/react-collapsible
import Collapsible from 'react-collapsible';

function VanOrdersToBeCollected({vanid}) {
    const [orders,setOrders]=useState([]);
    useEffect(()=>{
        let mounted = true;

        // Function to fetch ready orders of a van using vanid from the backend
        const fetchItem=async () =>{
            try {
            vendorAxios.get(`/van/ready-orders`)
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

    //Function to change orders status to completed
    const markCompleted = async (orderid) =>{
        try {
        vendorAxios.get(`/order/vendor-change-status/${orderid}/COMPLETED`)
            .then(res => {
            setOrders(orders.filter(item => item._id !== orderid));
            console.log("Order completed!");
        })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    // Screen to display no orders when there are no ready orders
    function displayNoOrders() {
        return (
            <>
            <div className="yellowBackground">
            <img className="noOrderIcon" width="70px"src="/VanOrderIcons/Waiting.svg" alt="Logo"/>
            <p></p>
            <h1 className="noOrderText">No orders ready to be collected yet.</h1>
            <Link to={`/van/menu`}>
                <p className="orderBack">Back</p>
            </Link>
            </div>
            </>
        )
    }

    // Display one ready order
    function displayOrders() {
        return (
            <>
            <div className="yellowBackground">
            <div style={{padding:"5vh"}}>
            <h1 className="vanOrderName" style={{textAlign:"center"}}>Orders To Be collected</h1>
            {orders&&(
                <div className="vanOrdersGrid">
                {orders.map(post =>(
                <div key={post._id}>
                <div className="vanOrderContainer" key={post._id}>
                    {/* Mark completed button */}
                    <ReadyOrderButton
                        onClick={() => {
                            markCompleted(post._id);

                            }
                        }
                    />
                    {displayModified(post)}
                    {displayDiscount(post)}
                    <h1 className="vanOrderID">Order #{post._id}</h1>
    
                    {/* The person's name */}
                    <div className="vanOrderItemsContainer">
                    <h1 className="vanOrderName">Name: {post.customer.firstName}</h1>
                    
                    {/* The items in the order */}
                    <Collapsible trigger={["View order items ", <img src="/VanOrderIcons/RightArrow.svg" width="15px" height="10px" alt="Logo"/>]} triggerClassName="viewOrderDetails" //
                    triggerOpenedClassName="viewOrderDetails" triggerWhenOpen={["View order items ", <img src="/VanOrderIcons/DownArrow.svg" width="15px" height="10px" alt="Logo"/>]}>
                        {post.orderItems.map(orderItem =>(
                            <>{displayOrderItem(orderItem)}</>
                        ))}
                    </Collapsible>
                    <Link to={`/van/ready-orders/${post._id}`}>
                        <p className="orderLink">View order details</p>
                    </Link>
                    </div>
                </div>
                </div>
                ))}
                </div>
            )}
            <Link to={`/van/menu`}>
                <p className="orderBack">Back</p>
            </Link>
            </div>
            </div>
            </>
        )
    }

    function displayDiscount(post) {
        if (post.discount > 0) {
            return (<><div className="modifiedBackground">
                <h1 className="modifiedText">{post.discount * 100}% discounted</h1>
            </div></>)
        }
        return (<></>)
    }

    // Display the order items in a collapsible
    function displayOrderItem(orderItem) {
        if (orderItem.qty > 0) {
            return (<>
            <div key={orderItem._id} className="vanOrderItemGrid brown">
                {/* The order item name and qty*/}
                <div><h1 className="orderItemTitle">{orderItem.itemID.name}</h1></div>
                <div><h1 className="orderItemTitle">x{orderItem.qty}</h1></div>
            </div>
            </>)
        }
        return (<></>)
    }

    // Display if an order is modified
    function displayModified(post) {
        if (post.isOrderModified) {
            return (<><div className="modifiedBackground">
                <h1 className="modifiedText">MODIFIED</h1>
            </div></>)
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

export default VanOrdersToBeCollected;