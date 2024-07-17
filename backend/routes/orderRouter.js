const express = require("express");
const passport = require("passport");

// adding the router
const orderRouter = express.Router()
const orderController = require("../controllers/orderController");

// show all orders (for debugging)
orderRouter.get("/", orderController.getAllOrders);

// create order
orderRouter.post("/new", 
    passport.authenticate("user-jwt", {session: false}),
    orderController.newOrder
);

// get one order
orderRouter.get("/get/:id", orderController.getOrder);

// add to order
orderRouter.get("/add/:id/:name/:qty", 
    passport.authenticate("user-jwt", {session: false}),
    orderController.addToOrder
);

// change status of an order
orderRouter.get("/customer-change-status/:id/:status", 
    passport.authenticate("user-jwt", {session: false}),
    orderController.customerChangeOrderStatus
);

orderRouter.get("/vendor-change-status/:id/:status",
    passport.authenticate("van-jwt", {session: false}),
    orderController.vendorChangeOrderStatus
)

// change modify status of an order
orderRouter.get("/modify/:id", 
    passport.authenticate("user-jwt", {session: false}),
    orderController.modifyOrder
);

// discount an order
orderRouter.get("/discount/:id", 
    passport.authenticate("van-jwt", {session: false}),
    orderController.applyDiscount
);

// and export the router
module.exports = orderRouter;