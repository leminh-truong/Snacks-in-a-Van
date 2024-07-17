
import { React } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.scss';

import 'bootstrap/dist/css/bootstrap.min.css'

function Home() {

    return (
            <>
            <div className="homeGrid">
            <Link style={{textDecoration:"none"}}to={`/customer/select-van`}>
                <div className="homeBackground">
                    <h3 className="homeTitle"> Customer App</h3>
                    
                    {/*<h2 className="homeLink">Select a van to order from</h2>*/}
                    
                </div> 
            </Link> 
            <Link style={{textDecoration:"none"}}to={`/van/login`}>
                <div className="homeBackground">
                    <h3 className="homeTitle"> Vendor App</h3>
                    {/*<h2 className="homeLink">Van Login</h2>*/}
                </div> 
            </Link> 
            </div>
            </>
    )
}

export default Home;