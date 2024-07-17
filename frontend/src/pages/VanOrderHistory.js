import {React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../styles/VanOrders.scss';
import '../styles/Van.scss';
import '../styles/Orders.scss';
import { vendorAxios } from '../Config';
import Loading from '../Components/Loading';

// The dependency "react-collapsibe" is an open-source 
// project authored by Glenn Flanagan. Informaion 
// about this dependecy can be found at:
// https://github.com/glennflanagan/react-collapsible
import Collapsible from 'react-collapsible';

function VanOrderHistory({vanid}){
    const[searchTerm, setSearchTerm] = useState("");

    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        let mounted = true;

        // function to fetch a van's completed orders using vanid from the backend
        const fetchItem=async () =>{
            try {
            vendorAxios.get(`/van/order-history`,
                {withCredentials: true}
            ).then(res => {
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

    //Display screen for when a van has no completed orders
    function displayNoOrders() {
        return (
            <>
            <div className="yellowBackground">
            <img className="noOrderIcon" width="70px"src="/VanOrderIcons/Waiting.svg" alt="Logo"/>
            <p></p>
            <h1 className="noOrderText">No completed orders yet.</h1>
            <Link to={`/van/menu`}>
                <p className="orderBack">Back</p>
            </Link>
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

    // Screen to display the van's completed orders
    function displayOrders() {
        return (
            <>
            <div className="yellowBackground">
            <div style={{padding:"5vh"}}>
            <h1 className="vanOrderName" style={{textAlign:"center"}}>Van Order History - Completed Orders</h1>

            {/* Create search bar to search for orders via customer name*/}
            <p></p>
            <input type="string" placeholder="Search order by Customer Name....." className="searchBar" onChange={(event) =>{
                setSearchTerm(event.target.value);
            }}
            />

            {/* Display orders searched by customer name, or display all orders if the searched name
            matches no orders */}
            {searchTerm 
            ? displaySearchOrder(searchTerm)
            : orders&&(
                <div className="vanOrdersGrid">
                {orders.map(post =>(
                <div key={post._id}>
                <div className="vanOrderContainer" key={post._id}>
                    {displayModified(post)}
                    {displayDiscount(post)}
                    <h1 className="vanOrderID">Order #{post._id}</h1>
    
                    {/* The customer's name */}
                    <div className="vanOrderItemsContainer">
                    <h1 className="vanOrderName">Name: {post.customer.firstName}</h1>
                    
                    {/* Contain order's items in a collapsible, press "View Order Items" to expand and collapse */}
                    <Collapsible trigger={["View order items ", <img src="/VanOrderIcons/RightArrow.svg" width="15px" height="10px" alt="Logo"/>]} triggerClassName="viewOrderDetails" //
                    triggerOpenedClassName="viewOrderDetails" triggerWhenOpen={["View order items ", <img src="/VanOrderIcons/DownArrow.svg" width="15px" height="10px" alt="Logo"/>]}>
                        {post.orderItems.map(orderItem =>(
                            <><div key={orderItem._id}>{displayOrderItem(orderItem)}</div></>
                        ))}
                    </Collapsible>

                    {/* Link to go to an order's detail page */}
                    <Link to={`order-history/${post._id}`}>
                        <p className="orderLink">View full order details</p>
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

    // Function to display orders searched via the search bar using a customer's name
    function displaySearchOrder(orderName){
        var index;
        var exists = false;
        for(index = 0; index < orders.length; index++){
            if(orders[index].customer.firstName.toUpperCase().includes(orderName.toUpperCase())){
                exists = true;
                break;
            }
        }
        if(exists){
            return (<>
                {orders&&(
                    <div className="vanOrdersGrid">
                    {orders.filter(order => order.customer.firstName.toUpperCase().includes(orderName.toUpperCase())).map(post =>(
                    <div key={post._id}>
                    <div className="vanOrderContainer" key={post._id}>
                        {displayModified(post)}
                        {displayDiscount(post)}
                        <h1 className="vanOrderID">Order #{post._id}</h1>
        
                        {/* The person's name */}
                        <div className="vanOrderItemsContainer">
                        <h1 className="vanOrderName">Name: {post.customer.firstName}</h1>
                        
                        {/* Contain order's items in a collapsible, press "View Order Items" to expand and collapse */}
                        <Collapsible trigger={["View order items ", <img src="/VanOrderIcons/RightArrow.svg" width="15px" height="10px" alt="Logo"/>]} triggerClassName="viewOrderDetails" //
                        triggerOpenedClassName="viewOrderDetails" triggerWhenOpen={["View order items ", <img src="/VanOrderIcons/DownArrow.svg" width="15px" height="10px" alt="Logo"/>]}>
                            {post.orderItems.map(orderItem =>(
                                <><div key={orderItem._id}>{displayOrderItem(orderItem)}</div></>
                            ))}
                        </Collapsible>
                        <Link to={`order-history/${post._id}`}>
                            <p className="orderLink">View full order details</p>
                        </Link>
                        </div>
                    </div>
                    </div>
                    ))}
                    </div>
                )}
                
            </>
            )
        }
        else {
            return(
                <>
                <p style={{textAlign:"center"}}>No orders match your search. </p>
                </>
            )
        }
    }

    // Display items in the order inside a collapsible
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

    // Choose which screen to display
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

export default VanOrderHistory;