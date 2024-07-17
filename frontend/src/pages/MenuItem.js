import {React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../styles/MenuItem.scss';
import { customerAxios } from '../Config';


function MenuItem({itemname}) {
    const [item,setItem]=useState([]);
    useEffect(()=>{
        // function to get the item from the backend using item name
        const fetchItem=async () =>{
            try {
            customerAxios.get(`/menu/${itemname}`)
                .then(res => {
                const itemsdata = res.data;
                setItem(itemsdata);
            })
            }
            catch (err) {
                console.error(err.response.status);
            }
        }

        fetchItem();
    },[itemname]);

    

    // function to get the price formatted correctly out the database
    function getFloat(value) {
        return value && value['$numberDecimal'] ? value['$numberDecimal'] : 0;
    }

    return (
        <ul style={{width: "400px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="menuItemRound">
        <img src={item.image} className="menuItemImage" alt="Snack"/>
        </div>
        <h1 className="itemTitle">{item.name}</h1>
                <h3 className="itemPrice"> <span className="itemPrice">${getFloat(item.price)}</span></h3>
                <p className="itemDescription">{item.description}</p>
        <Link to={'/menu'}>
            <p className="back">back to menu</p>
        </Link>
        </ul>
    )
}

export default MenuItem;