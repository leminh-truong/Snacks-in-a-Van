import {React} from 'react'
import { BrowserRouter as Router ,Switch,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
// And the map css file
import 'mapbox-gl/dist/mapbox-gl.css';

// Add the config
import "./Config";

// Add the Private Route redirects
import PrivateRoute from "./Components/PrivateRoute";
// and its opposite
import PublicRoute from "./Components/PublicRoute";

// page references
import Menu from "./pages/Menu";
import Home from "./pages/Home";
import Vans from "./pages/Vans";
import Van from "./pages/Van";
import ViewOneOrder from "./pages/ViewOneOrder";
import ViewOrderHistory from "./pages/ViewOrderHistory";
import VanOrders from "./pages/VanOrders";
import VanOrderHistory from "./pages/VanOrderHistory";
import ViewOneVanOrder from "./pages/ViewOneVanOrder";
import ViewOneUncollectedOrder from "./pages/ViewOneUncollectedOrder";
import VanOpen from "./pages/VanOpen";
import VanRelocate from "./pages/VanRelocate";
import CustomerSignUp from "./pages/CustomerSignUp";
import CustomerSelectVan from "./pages/CustomerSelectVan";
import Login from './pages/Login';
import Logout from "./pages/Logout";
import CustomerNotSignedIn from './pages/CustomerNotLoggedIn';
import Profile from "./pages/Profile";


import {Nav, NavCustomer, NavVendor} from "./Components/Nav";
import VanLogin from './pages/VanLogin';
import VanOrdersToBeCollected from './pages/VanOrdersToBeCollected';
import { isUserAuthenticated } from './Components/Auth';

// And so the .env can be accessed
require("dotenv").config();

function App() {

    // return corresponding page from a specific route
    // in order to correctly display the frontend
    // apparently the order of these switch statements matter!!
    return (
        <Router>
            <Switch>
                <Route exact path="/"><Nav/></Route>
                {(<Route path="/van/:id" render={({match})=>(
                    <><NavVendor vanid={match.params.id}/> </>
                    )}/>
                )}
                <Route path="/van"><Nav/></Route>
                <Route path="/"><NavCustomer/></Route>
            </Switch>

            <Container>
            <Switch>

                {/* Home page route */}
                <Route path="/" exact component={Home}/>  

                {/* Menu route */}          
                <Route path="/menu/:id" exact component={Menu}/>

                {/* Order route */}
                <Route path="/order" exact component={ViewOrderHistory}/>

                {/*View a single order*/}
                {(<Route path="/order/get/:id" render={({match})=>(
                    <> <ViewOneOrder order_id={match.params.id}/> </>
                    )}/>
                )}

                {/* Display van options for customer*/}
                <Route path="/customer/select-van" exact component={CustomerSelectVan}/>

                {/* Display all vans route */}
                <Route path="/van" exact component={Vans}/>

                 {/* The van login page */}
                <Route path="/van/login" exact component={VanLogin} />
                
                {/* Display van orders route providing the van id */}
                <Route path="/van/outstanding-orders" exact component={VanOrders} />

                
                {/* View a single order from van's order history*/}
                {(<Route path="/van/order-history/:orderid" render={({match})=>(
                    <> <ViewOneVanOrder orderid={match.params.orderid}/> </>
                    )}/>
                )}

                {/* Display van order history route providing the van id */}
                <Route path="/van/order-history" exact component={VanOrderHistory} />

                {/* View a single order from van's order history*/}
                {(<Route path="/van/ready-orders/:orderid" render={({match})=>(
                    <> <ViewOneUncollectedOrder vanid={match.params.id} orderid={match.params.orderid}/> </>
                    )}/>
                )}

                <Route path="/van/ready-orders" exact component={VanOrdersToBeCollected} />

                {/* Display van open page */}
                {(<Route path="/van/open" exact component={VanOpen} />)}

                {/* and the van relocate page */}
                <Route path="/van/relocate" exact component={VanRelocate} />

                {/* Display van menu */}
                <Route path="/van/menu" exact component={Van} />

                {/* Signup route */}
                <PublicRoute path="/signup" exact component={CustomerSignUp}/>

                {/* User Login/logout route */}
                <PublicRoute path="/login" exact component={Login}/>
                <PrivateRoute path="/logout" authFunction={isUserAuthenticated()} exact component={Logout} />
                <PublicRoute path="/notloggedin" exact component={CustomerNotSignedIn} />

                {/* For the profile route */}
                <PrivateRoute path="/profile" authFunction={isUserAuthenticated()} exact component={Profile} />

            </Switch>
            </Container>
        </Router>
    )
}
const Container= (props) => (
    <div style={{
      height:'100vh',
      width:'100%',
      padding:'5vh'
  }} {...props}/>
)
  
export default App