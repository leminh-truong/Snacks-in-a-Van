import { React, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import '../styles/Menu.scss';
import { customerAxios } from '../Config';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css'
import Popup from '../Components/Popup.js';
import { isUserAuthenticated } from "../Components/Auth";
import Loading from "../Components/Loading";

function Menu() {
    const [item,setItems]=useState([]);
    const [pending,setPending]=useState([]);

    let {id} = useParams();
    const [isPopupOpen,setIsPopupOpen] = useState(false);
    const [isLoginPopUp,setIsLoginPopup] = useState(false);
    const [vanId] = useState(id);
    const [selectedItem, setSelectedItem] = useState([]);
    const [isFound,setIsFound] = useState(false);
    const [orderItems, setOrderItems] = useState({});
    // storing the current quantity
    let [quantity, setQuantity]= useState(0);

    // And for the total cost & quantity
    let [totalCost, setTotalCost] = useState(0);
    let [totalQuantity, setTotalQuantity] = useState(0);

    const fetchItems=async () =>{
        try {
            customerAxios.get('/menu/')
                .then(res => {
                    const itemsdata = res.data;
                    setItems(itemsdata);
            })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }
    // We'll only do these things once
    useEffect(() => {
        // Get pending from database 
        const fetchOrder=async () =>{
            try {
                await customerAxios.get(`/user/getpending/${vanId}`,
                    {withCredientials: true})
                    .then(res => {
                        console.log(res)

                        let order = res.data;
                        if (order){
                            setPending(order);

                            // put all items in a dictionary with the item as the 
                            // key and the value as the quantity
                            let pendingOrder = {};

                            order.orderItems.forEach((item) => {
                                pendingOrder[item.itemID] = item.qty;
                            });

                            addPreviousOrder(pendingOrder);

                            setIsFound(true);                            
                        }
        })}
            catch (err) {
                console.error(err.response.status);
            }
        }
        const loadMenu = () => {
            // Get the items
            fetchItems();
            
            // And check if they're logged in and have a pending order
            // in progress
            if (isUserAuthenticated())
                fetchOrder();
        }

        loadMenu();
    }, [vanId]);
    
    useEffect(() => {
        const calcTotals = () => {
            let cost = 0.0;
    
            item.forEach((post) => {
                if (orderItems[post._id] && orderItems[post._id] > 0) {
                    cost += parseFloat(post.price.$numberDecimal) * orderItems[post._id];
                }
            });
    
            setTotalCost(cost);
            // Get the total quantity
            setTotalQuantity(Object.values(orderItems).reduce((a, b) => a + b, 0));
        }

        calcTotals();
    }, [orderItems, item]);

    const createOrder=async () =>{
        // Update the local frame
        updateQuantity(selectedItem._id, quantity);
        
        // Then do it on the database
        try {
            const res = await customerAxios.post(`/order/new`,{
                'van': vanId,
                orderItems:[{
                    itemID:selectedItem._id,
                    qty:quantity
                }]
            }, {withCredentials: true}).then(console.log("made a new order"))

            // then save that order's details
            setPending(res.data);
            setIsFound(true);
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    const addToOrder=async () =>{
        // Update the quantity here
        updateQuantity(selectedItem._id, quantity);
        // And then send it off to the database
        try {
            await customerAxios.get(`/order/add/${pending._id}/${selectedItem._id}/${quantity}`,
            {withCredentials: true});
            setIsFound(true);
        }
        catch (err) {
            console.log(err);
            console.error(err.response.status);
        }
        
    }

    const updateQuantity = (newItem, newQty) => {
        setOrderItems({...orderItems, [newItem]: newQty});
        console.log("orderItems:", orderItems);
    }

    const addPreviousOrder = orderItems => {
        setOrderItems(orderItems);
    }
    
    const getQuantity = (id) => {
        if (orderItems[id] <= 0)
            return "";
        return orderItems[id];
    }

    const openPopup = (post) => {
        if (!isUserAuthenticated()){
            setIsLoginPopup(true);
        }

        else {
            setSelectedItem(post);
            // get the quantity already there
            if (orderItems[post._id])
                setQuantity(orderItems[post._id]);
            else
                setQuantity(0);
            setIsPopupOpen(!isPopupOpen);
        }
    }

    const closePopup = () => {
        // reset the counter
        setIsPopupOpen(!isPopupOpen);
    }
    const closeLoginPopup = () => {
        setIsPopupOpen(!isPopupOpen);
        setIsLoginPopup(false);
    }
    const reduceQuantity = () => {
        if (quantity === 0){
            return;
        } else {
            setQuantity(quantity-1);
        }
    }
    const increaseQuantity = () => {
        setQuantity(quantity+1);
    }

    const history = useHistory();
    const routeChange = (path) => {
        history.push(path);
    }

    const completeOrder = () => {
        // First check if the order has no items in it
        if (totalQuantity === 0){
            alert("Please order at least one item");
            return;
        }

        try {
            customerAxios.get(`/order/customer-change-status/${pending._id}/OUTSTANDING`, {withCredentials: true})
            .then(res => {
                // and redirect the user to the order status page
                routeChange(`/order/get/${pending._id}`);
            })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }

    const addToOrderItem = () => {
        if (isFound){
            //add to pending
            addToOrder();
        }

        else{
            // otherwise make a new order
            createOrder();
        }
        closePopup();
    }


    // function to get the price formatted correctly out the database
    function getFloat(value) {
        return value && value['$numberDecimal'] ? value['$numberDecimal'] : 0;
    }

    return (
        <div position="relative">
        <h1 className="menuTitle">Menu</h1>
        {isLoginPopUp && <Popup content={<>
                <p className="popupHeader"> You are not logged in!</p>
                <p className="popupText">
                <a href="/notloggedin" >Go log in?</a></p>
                </>}
                handleClose={closeLoginPopup}
        />}
        {isPopupOpen && <Popup
            content={<>

            <p className="popupHeader">{selectedItem.name}</p>
            <p className="popupText">
                <QtyButton onClick={() => reduceQuantity()}><div className="qtyButtonText">-</div></QtyButton> 
                    &nbsp;Qty: {quantity} &nbsp;
                <QtyButton onClick={() => increaseQuantity()}><div className="qtyButtonText">+</div></QtyButton></p>
            <p className="popupText">${getFloat(selectedItem.price)*quantity}</p>
            <button className="centeredButton" onClick={()=>{addToOrderItem();}}>Update order</button>
            </>}
            handleClose={closePopup}
        />}



        <div className="menuBackground">
        {item.length > 0 ? (<>
        {item.map(post =>(<div key={post._id}>
            <div className="menuGridContainer">
                <div className="menuRound">
                    <img src={post.image} className="menuImage" alt="Snack"/>
                </div>
                <div>
                    <h3 className="menuItem">{post.name} </h3>
                </div>
                <div>
                    <h3 className="menuPrice">    ${getFloat(post.price)}</h3>
                </div>
                <div>
                    <h3 className="menuPrice">    {getQuantity(post._id)} </h3>
                </div>
                <div>
                    <Button onClick={() => openPopup(post)}>
                        <div className="plusButtonText">+</div>
                    </Button>
                </div>
            </div>
            </div>
            ))}
        </>
        ) : <Loading />}
        <div className="menuTotal">Total: ${totalCost} </div>
        <p className="menuStats">Number of items: {totalQuantity}</p>
        
        </div>
            <p></p>
            <button className="centeredButton" onClick={()=> completeOrder()}>Confirm Order</button>
        </div>
    )
}
const QtyButton = styled.button`
  background-color: rgba(52, 52, 52, 0);
  padding: 0px 6px;
  border-radius: 2vh;
  cursor: pointer;
  border-style: none;
`;

const Button = styled.button`
  background-color: white;
  border-radius: 2vh;
  cursor: pointer;
  border-style: none;
  position: relative;
  top: 1vh;
`;
  
export default Menu;