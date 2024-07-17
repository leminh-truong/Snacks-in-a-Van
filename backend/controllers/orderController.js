const { order } = require('../models/orderModel');
const {orderItem} = require('../models/orderModel');

const VAN_MODIFICATIONS = ["READY", "COMPLETED"]

const newOrder = async (req, res) => {
    const newOrder = new order({
        van: req.body.van,
        orderItems: req.body.orderItems,
        customer: req.user._id
    });

    newOrder.save( (err, result) => {
        if (err) res.send(err);
        return res.send(result);
    })
}

const getAllOrders = async (req,res) => {
    try {
        const all_orders = await order.find( {}, {} )
        res.send(all_orders);
    }
    catch (err) {
        res.status(400);
        res.send("Query failed, no van with that name");
    }
}

const customerChangeOrderStatus = async (req, res) => {
    // first see if the customer is not doing something they shouldn't be
    // i.e. completing an order
    if (VAN_MODIFICATIONS.includes(req.params.status)){
        res.status(403); // forbidden
        res.send("not permitted to do action");
        return
    }

    try {
        // update the order instance
        await order.updateOne({_id: req.params.id}, {$set: {status: req.params.status}});
        res.send("Update complete");
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send("Change order status failed.")
    }
}

const vendorChangeOrderStatus = async (req, res) => {
    try {
        await order.updateOne({_id: req.params.id}, {$set: {status: req.params.status}});
        if (req.params.status == "READY") {
            await order.updateOne({_id: req.params.id}, {$set: {dateReady: new Date()}});
            console.log("Updated date ready");
        } else if (req.params.status == "OUTSTANDING") {
            await order.updateOne({_id: req.params.id}, {$set: {date: new Date()}});
            console.log("Updated order date");
        }
        res.send("Update complete")
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.send("Change order status failed.")
    }
}

const modifyOrder = async (req, res) => {
    // Find order from ID given
    try {
        await order.updateOne({_id: req.params.id}, {$set: {isOrderModified: true}});
        res.send("Order set to modified")
    }
    catch (err) {
        res.status(400);
        res.send("Modify order failed")
    }
}

const applyDiscount = async (req, res) => {
    // Find order from ID given
    try {
        await order.updateOne({_id: req.params.id}, {$set: {discount: 0.2}});
        res.send("Order discounted!")
    }
    catch (err) {
        res.status(400);
        res.send("Apply discount failed")
    }
}

// Gets an order by ID and "populates" the menuItems and van details
// into the order details.
const getOrder = async (req, res) => {
    try {
        const result = await order.findById(req.params.id).populate("orderItems.itemID").populate("van");
        res.send(result);
    }
    catch (err) {
            res.status(400);
            res.send("Get order failed");
    }
}

// Add an item to an existing order
const addToOrder = async (req, res) => {
    try {
        // find order by ID
        let queryOrder = await order.findById(req.params.id);
        
        // find snack by name

        // check if duplicate of item
        let updated = false;
        for (var i of queryOrder.orderItems) {

            // update qty of item
            if (i.itemID.equals(req.params.name)) {
                console.log("updating item!");
                i.qty = parseInt(req.params.qty);
                updated = true;
                break;
            }
        }
        
        // else push new item to order
        if (updated == false) {
            let newItem = new orderItem ({
                itemID: req.params.name,
                qty: req.params.qty
            })
            queryOrder.orderItems.push(newItem)
        };
        
        // This line saves the items, delete this if this line not necessary
        await queryOrder.save();

        const result = await order.findById(req.params.id);
        res.send(result);
    }
    catch (err) {
            console.log(err)
            res.status(400);
            res.send("Query failed");
    }
}

module.exports = {
    customerChangeOrderStatus, 
    vendorChangeOrderStatus,
    newOrder, 
    getOrder, 
    addToOrder, 
    getAllOrders, 
    modifyOrder,
    applyDiscount
};
