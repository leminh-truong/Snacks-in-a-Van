import {React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../styles/Menu.scss';
import { vendorAxios } from '../Config';

import 'bootstrap/dist/css/bootstrap.min.css'
import Loading from '../Components/Loading';

function Vans() {
    const [vans,setVans]=useState([]);
    useEffect(()=>{
        // Get vans from the backend
        const fetchItems=async () =>{
            try {
                vendorAxios.get('/van')
                    .then(res => {
                    const itemsdata = res.data;
                    setVans(itemsdata);
                })
            } catch (err) {
                console.error(err.response.status);
            }
        }

        fetchItems();
    },[vans]);

    return (
        <>
        <h1 className="menuTitle">List of all vans - Temporary page</h1>
        {vans.length > 0 ? 
            <div className="selectVanGridContainer">
                {vans.map(post =>(<div key={post._id}>
                    <Link style={{textDecoration:"none"}}to={`/van/${post._id}`}>
                        <div className="selectVanButton">
                            <div className="selectVanButtonText">{post.name}</div>
                        </div>
                    </Link>
                    </div>))}
            </div> : <Loading /> 
        }
        </>
    )
}
  
export default Vans;