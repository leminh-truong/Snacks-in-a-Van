const mongoose = require("mongoose");
const Model = require("../models/menuModel");



//a comment
const getCurrentMenu = async (req, res) => {
    // Connect to DB
    const Menu = mongoose.model('menuitems', Model.menuItemsSchema);

    // Find all matching items and return
    try {
        const result = await Menu.find({});
        res.send(result);
    }

    catch (err) {
        console.log(err);
        res.status(400);
        res.send("Query failed");
    }  
}



const getMenuItemByName = async (req,res) => {
    // connect to the DB

    // Load right table
    const Menu = mongoose.model("menuitems", Model.menuItemsSchema);

    // and source the right menu item from the request
    try {
        const item = await Menu.findOne( {name: req.params.name}, {} )
        res.send(item);
    }
    catch (err) {
        res.status(400);
        res.send("Query failed, no item with ID");
    }
}

module.exports = {getCurrentMenu, getMenuItemByName};