
<p align="center">
  <img src="./images/icon.svg"  width="15%" >
</p>

# Snacks in a Van
**A web app by the Dev Dogs**

## How to run the program
Just head to the [Heroku page](https://devdogs.herokuapp.com)!
### ... or locally:
1. Install dependencies with `npm run setup`
2. Make sure the file ".env" exists in the /backend folder, and that it looks like this:
    ```
    MONGODB_URI = mongodb+srv://tutor:dev-dogs@cluster0.vqmbt.mongodb.net/?retryWrites=true&w=majority
    PASSPORT_KEY=barkbark!
    ```
    Another `.env` file in `./frontend` is required to be generated. An example key given below.
    ```.env
    REACT_APP_MAPGL_ACCESS_TOKEN=pk.eyJ1IjoiamFja2ozIiwiYSI6ImNrb3M3NWsxcDAwc3gyb3A3ejdzNHd0dncifQ.XuuRLoztfP_ugwl2vUcEmQ
    ```

4. Open app by typing `npm run dev` in the root folder in the command line.

⚠️ Notes for running locally: 
- If you get an error saying `Error: listen EADDRINUSE: address already in use :::5000`, then you need to kill any processes that are already running on port 5000 and try again. You can use the command `lsof -i :5000` to check what processes are running on port 5000, and then `kill <insert_PID_here>` to kill a process.
- Errors containing the word "npm" are most likely due to node packages being improperly installed, or not installed at all. If `npm run setup` doesn't work for some reason, try also `npm i`.
- Other errors are *most likely* due to improper .env files. Please double check you have all the .env files mentioned above.

A sample database user has been created for marking, the URI is provided here.
`mongodb+srv://tutor:dev-dogs@cluster0.vqmbt.mongodb.net/?retryWrites=true&w=majority`

⚠️ Notes for testing: 
- Please make sure you are *logged out* of the Customer app before you try to log into the Vendor app, and of course make sure you log out of the Vendor app before you try to log into the Customer app. You cannot be logged into both at the same time.
- Also, clicking around too fast may cause strange things to happen. Try to take things at a reasonable pace.
- Sadly we didn't have enough time to implement live pages. If something isn't updating, please refresh the page.
- In terms of the discount feature, an order can only be discounted if the vendor is logged in and is actively monitoring the "New Orders" page, and of course only if they don't complete the order in time. This is to prevent customers from being able to apply discounts to their own orders; only the vendor is able to do so.
- See login details [here](#login-details)

## Team members
| Name | Student Number |
| --   |      --        |
| Jack Jones | 913794 |
| Yuji Nojima| 1122662|
| Jessica Hammer | 1064777 |
| Chiquitta Kellie | 1118799 |
| Le Minh Truong | 1078113 |

## Technologies used
- NodeJS
- MongoDB, hosted on MongoDB Atlas
- Express
- React
- Passport
- bCrypt
- Mongoose
- MapBox
- react-collapsible

## Attributions
The majority of icons for this project were sourced from https://thenounproject.com/ (with the exception of the main van logo which was drawn by Jess). The photos for the snacks were sourced from https://unsplash.com/.
The "react-collapsible" dependency used for this project was sourced from https://github.com/glennflanagan/react-collapsible. Information about its installation and usage can also be found at https://github.com/glennflanagan/react-collapsible. 

## Login details
For testing customer login, use the dummy account with email = test@test.com and password = I like apples

For logging into a van, you can use any of the following credentials
- Van name: Tasty Trailer   Password: hi123456
(this van is the only van with a different password, and obviously if we were actually to release this app we would make the passwords more secure, this is just for testing convenience)

Use password = 123456 for the following vans:
- Van name: Caffeine Carriage
- Van name: Biscuit Bus
- Van name: Cookie Car
- Van name: Snack Ship

## Running integration and unit tests
To run the scripts for integration and unit tests for this project, do as followed:
- Move the current directory to the "/project-t15-devdogs/backend" directory (e.g. via "cd" commands)
- Run the following command: 
   + To run all integration and unit tests: npm test
   + To run a specific test: npm test -- <test-script-name>
       e.g. npm test -- IntegrationTestVanStatusSetting.js
  
## 📱 How to use the app
**Customer app:**
- First, select a van to order from at https://devdogs.herokuapp.com/customer/select-van. Then build up your order by adding items with the '+' button. Hit 'Confirm Order' to make the order, then an order summary page will appear. If you haven't logged in yet, you will have to log in before making any changes to your order.
- You can also log in or go to your profile at any time by clicking on the account icon in the nav bar or by going to https://devdogs.herokuapp.com/profile. Here you can also choose to view your order history or log out. If you are not logged in, it will prompt you to make an account or log in. You can also choose to edit your name or password by clicking on the pencil icons. 
- In your order history, you can click "view order details" to see more details about the order. If the order status is outstanding and it's not too late, you can also cancel (click bin icon) or edit (click pencil icon) the order. 
- Return to the home page at any time by clicking on the van icon or title in the nav bar.

**Vendor app:**
- First, log into a van with the van name and password. Make sure you are not currently logged into the customer app. Then, you should see the van menu page, where you can choose to open the van, logout, view order history, view outstanding orders, and view orders to be collected. Usually, choosing to open the van first would make the most sense.
- Opening the van involves specifying a location in text and choosing a place on the map to open. To use your current location make sure you enable location services, and click the icon in the top right of the map. Sometimes the status takes a while to update. Refresh the page if this is the case. Once a van is opened, it can be closed again by clicking the close van button in the van menu page.
- In the new orders page (also known as the oustanding orders page), clicking the green tick on the order will mark it as ready to be collected. 
- In the orders to be collected page, clicking the green tick will mark it as complete, meaning it has been picked up by the customer.
- Completed orders can be viewed in the order history page, and searched for by customer name.
- You can return back to the van menu page at any time by clicking on the home menu icon in the top right of the nav bar.
- A vendor should only be able to log out of the van if there are no more outstanding orders.

# How the app works
See the [report](/Web%20info%20report.pdf).

## 🗺️ Backend Routes (For Deliverable 2 - old)
Some sample requests can be found in the [Postman JSON file](./Snacks_in_a_Van_Heroku.postman_collection.json)

### 👤 User Routes
**Add a user:** Done in a POST request using `https://devdogs.herokuapp.com/api/user/create`. This calls `createUser()` which adds a new user to the database.

### ☕ Menu Routes
**Get a menu item:** Done in a GET request using `https://devdogs.herokuapp.com/api/menu/:name`. This calls `getMenuItemByName()` which gets a menu item using the `:name` provided in the url.

**Get the whole menu:** Done in a GET request using `https://devdogs.herokuapp.com/api/menu/`. This calls `getCurrentMenu()` which just returns a list of all the menu items in the database.

### 🗒️ Order Routes
**Create an order:** Done in a POST request using `https://devdogs.herokuapp.com/api/order/new`. This calls `newOrder()` which just creates a new order from the order items, van id and customer id provided, storing it in the database.

**Add an item to existing order:** Done in a GET request using `https://devdogs.herokuapp.com/api/order/add/:id/:name/:qty`. This calls `addToOrder()` which uses the order id `:id`, name of snack `:name`, and quantity of the item `:qty` in order to find an existing order in the database and update it accordingly. If the snack has been added to the order previously, its quantity is modified but if it's a new snack, it is pushed as a new order item to the array.

**Changing order status:** Done in a GET request using `https://devdogs.herokuapp.com:5000/api/order/change-status/:id/:status`. This calls `changeOrderStatus()` which uses the order id `:id` to update its status.
- When sent with a `status` as `OUTSTANIDNG`, the customer has completed composing their order. It will be visible for the van at this point.
- A `status` of `READY` is sent when the van has fulfilled the order and wishes it to be visible as ready for pickup to the customer.

**Get a particular order:** Done in a GET request using `https://devdogs.herokuapp.com/api/order/get/:id`. This calls `getOrder()` which finds and returns an order whose id matches `:id`.

### 🚙 Van Routes
**Get all vans:** Done in a GET request using `https://devdogs.herokuapp.com/api/van`. This calls `getAllVans()` which returns the list of vans in our database.

**Get all open vans:** Done in a GET request using `https://devdogs.herokuapp.com/api/van/all-open`. This calls `getAllOpenVans()` which returns the list of vans that have `isOpen == true` in our database.

**Get a particular van:** Done in a GET request using `https://devdogs.herokuapp.com/api/van/:id`. This calls `getVanByID()` which finds and returns the van that has matching `:id` in our database.

**Get a van's outstanding orders:** Done in a GET request using `https://devdogs.herokuapp.com/api/van/:id/outstanding-orders`. This calls `getVansOutstandingOrders()` which finds and returns the orders in our database that have a van id matching the `:id` parameter and that have a status of "OUTSTANDING".

**Update a van as open and set location:** Done in a GET request using `https://devdogs.herokuapp.com/api/van/:id/open-van/:xpos/:ypos`. This calls `openVan()` which finds the van that matches `:id`, then sets isOpen to true, and sets its coordinates to [`:xpos`, `:ypos`] which corresponds to its latitude and longitude.

**Update a van as closed:** Done in a GET request using `https://devdogs.herokuapp.com/api/van/:id/close-van`. This calls `closeVan()` which finds the van that matches `:id`, then sets isOpen to false, and sets its coordinates to [0, 0].
