const express = require("express");

// adding the router
const menuRouter = express.Router()
const menuController = require("../controllers/menuController");


menuRouter.get("/", menuController.getCurrentMenu);

menuRouter.get("/:name", menuController.getMenuItemByName);

menuRouter.get("/order-from/:id", menuController.getCurrentMenu);

// and export the router
module.exports = menuRouter;