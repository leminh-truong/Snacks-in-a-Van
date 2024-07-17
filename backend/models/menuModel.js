var mongoose = require("mongoose");

const menuItemsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    photo: String,
    description: String,
    price: {type: mongoose.Decimal128 , default: 0}
})



const menu =  mongoose.model("menuitems", menuItemsSchema);
module.exports = { menu}