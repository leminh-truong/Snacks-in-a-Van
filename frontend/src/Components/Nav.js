import {React} from 'react'
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Nav.scss';
function Nav() {
    return (
        <Noov>
            <div className="Nav">
                <Link  to={`/`}>
                <img className="interactive" src="/VanIcon.svg" title="Return to home page" alt="Logo"/>
                </Link>
                <Link  style={{textDecoration: "none"}}to={`/`}>
                <h1 className="navTitle"><i>Snacks in a Van</i></h1>
                </Link>
                <div></div> 
            </div>
        </Noov>
    )
    
}
function NavCustomer() {
    return (
        <Noov>
            <div className="Nav">
                <Link  to={`/`}>
                <img className="interactive" src="/VanIcon.svg" title="Return to home page" alt="Logo"/>
                </Link>
                <Link  style={{textDecoration: "none"}}to={`/customer/select-van`}>
                <h1 className="navTitle"><i>Snacks in a Van</i></h1>
                </Link>
                <Link  style={{padding: "0px"}}to={`/profile`}>
                <img className="profileimg interactive " src="/AccountIcon.svg" title="View account" alt="Account icon"/>
                </Link>
            </div>
        </Noov>
    ) 
}
function NavVendor({vanid}) {
    return (
        <Noov>
            <div className="Nav">
                <Link  to={`/van/menu`}>
                <img className="interactive" src="/VanIcon.svg" title="Return to home page" alt="Logo"/>
                </Link>
                <Link  style={{textDecoration: "none"}}to={`/van/menu`}>
                <h1 className="navTitle"><i>Snacks in a Van</i></h1>
                </Link>
                <Link  style={{padding: "0px"}}to={`/van/menu`}>
                <img className="interactive" src="/VanMenuIcons/HomeMenu.svg" title="Van menu" alt="Van Menu"/>
                </Link>
            </div>
        </Noov>
    ) 
}

const Noov= (props) => (
    <div style={{
      height:'10vh',
      width:'100%',
      background:"#EEC3B0",
      //borderRadius:"0px 0px 50px 50px",
  }} {...props}/>
)

export default Nav;
export {Nav, NavCustomer, NavVendor};