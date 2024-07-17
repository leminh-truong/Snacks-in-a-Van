var mongoose = require("mongoose");

// define the order items schema
const orderItemSchema = new mongoose.Schema({
    itemID: {type: mongoose.Schema.Types.ObjectId, ref: 'menuitems'},
    qty: {type: Number, default: 1}
})

// define the order schema
const orderSchema = new mongoose.Schema({

    // Associates a customer to an order
    customer: {type: mongoose.Schema.Types.ObjectId, ref:"user", index: true, required: true},

    // Associates a van to an order
    van: {type: mongoose.Schema.Types.ObjectId, ref: "vans", index: true, required: true},

    // Order items each have a quantity
    orderItems: [{itemID: {type: mongoose.Schema.Types.ObjectId, ref: "menuitems"},
                qty: {type: Number, default: 1}
    }],

    // Date the order was placed
    date: {type: Date, default: Date.now},

    // Date the order was ready. 
    // If order status is not currectly 'READY' or 'COMPLETE' this field is irrelevant
    dateReady: {type: Date, default: Date.now},

    // Boolean to indicate whether the user edited their order
    isOrderModified: {type: Boolean, default: false},

    // Double to indicate whether a discount has been applied
    discount: {type: Number, default: 0},

    // Enum for the different statuses a order may have
    status: {
        type: String,
        enum: ['PENDING', 'OUTSTANDING', 'READY', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    }
})

// compile the Schemas into Models
const orderItem = mongoose.model('orderItem', orderItemSchema)
const order = mongoose.model('order', orderSchema)

module.exports = {orderItem, order}