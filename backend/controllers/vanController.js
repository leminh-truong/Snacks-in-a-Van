require('dotenv').config();
const mongoose = require("mongoose");
const passport = require("passport"), LocalStrategy = require ("passport-local");
const JwtStrategy = require("passport-jwt");
const { order } = require("../models/orderModel");
const Model = require("../models/vanModel");
const Van = mongoose.model('vans', Model.vanSchema);

// The signin strategy
passport.use("van-login", new LocalStrategy({
    usernameField: "name",
    },
    async (name, password, done) => {
        try {
            // Find the van and get only the name and password
            await Van.findOne({name: name}, 'name password', async (err, van) => {
                // First see if an error has happened
                if (err) {
                    console.log("error fetching from database");
                    return done(err);
                }
                // or no van with that name
                if (!van)
                    return done(null, false, {message: "Null van"});

                // now see if the password matches
                const isMatch = await van.comparePassword(password);

                if (!isMatch)
                    // authentication not successful
                    return done(null, false, {message: "Incorrect van name or password"});
                
                else
                    // everything's G
                    return done(null, van, {message: "Logged in now"});
            });
        } catch (err) {
            console.log(err);
            return done(err);
        }
    })
)

// and for authenticating JWT for vans
// For authenticating the user using the token
passport.use("van-jwt", new JwtStrategy.Strategy({
    jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PASSPORT_KEY
}, (jwt_payload, done) => {
    // Search for the user
    Van.findOne({"name": jwt_payload.body._id}, (err, user)  => {
        if (err) {
            return done(err, false);
        }
        // Found the user, pass it over to passport
        if (user) {
            return done(null, user);
        }
        // Authentication failed.
        else {
            return done(null, false)
        }
    })
}))


const getVan = async (req,res) => {
    try {
        const van = await Van.findOne({_id: req.user._id});
        res.send(van);
    }
    catch (err) {
        res.status(400);
        res.send("Query failed, no van with that id");
    }
}

const getAllOpenVans = async (req, res) => {
    try {
        const van = await Van.find({isOpen: true});
        res.send(van);
    }
    catch (err) {
        res.status(400);
        res.send("Query failed, no van with that name");
    }
}

const getAllVans = async (req,res) => {
    try {
        const van = await Van.find( {}, {} )
        res.send(van);
    }
    catch (err) {
        res.status(400);
        res.send("Query failed, no van with that name");
    }
}

const getVansOutstandingOrders = async (req, res) => {
    try {
        const outstandingOrders = await order.find({van: req.user._id, status: "OUTSTANDING"})
        .populate("orderItems.itemID")
        // And just send ONLY the customer's first and last names
        .populate("customer", ["firstName", "lastName"]);
        res.send(outstandingOrders);
    }
    catch (err) {
        console.log(err)
        res.status(400);
        res.send("Query failed.");
    }
}

const getVansOrderHistory = async (req, res) => {
    try {
        const orderHistory = await order.find({van: req.user._id, status: "COMPLETED"})
        .populate("orderItems.itemID")
        // And just send ONLY the customer's first and last names
        .populate("customer", ["firstName", "lastName"]);
        res.send(orderHistory);
    }
    catch (err) {
        console.log(err)
        res.status(400);
        res.send("Query failed.");
    }
}

const getVansUncollectedOrders = async (req, res) => {
    try {
        const orderHistory = await order.find({van: req.user._id, status: "READY"})
        .populate("orderItems.itemID")
        // And just send ONLY the customer's first and last names
        .populate("customer", ["firstName", "lastName"]);
        res.send(orderHistory);
    }
    catch (err) {
        console.log(err)
        res.status(400);
        res.send("Query failed.");
    }
}

const getVanOneOrder = async(req, res) => {
    try{
        const OrderHistory = await order.findById(req.params.orderid)
        .populate("orderItems.itemID")
        .populate("van")
        .populate("customer", ["firstName", "lastName"]);
        res.send(OrderHistory);
    }
    catch (err) {
        res.status(400);
        res.send("Get order failed");
    }
}

// set isOpen to true
const openVan = async (req,res) => {
    try {
        const van = await Van.findByIdAndUpdate(req.user._id, {
            isOpen: true,
            location: {
                type: "Point", 
                coordinates: [req.body.xpos, req.body.ypos]
            },
            locationString: req.body.locationString
        }, {useFindAndModify: false});
        res.send(van);
    } catch (err) {
        console.log(err)
        res.status(400);
        res.send("Failed to update position");
    }
}

// set isOpen to false
const closeVan = async (req,res) => {
    try {
        // first see if there the van has any orders
        // that are waiting (if we need to)
        if (req.body.checkOutstanding) {
            const numbOutstanding = await findNumberOutstanding(req.user._id);
            
            // have existing, exit
            if (numbOutstanding > 0){
                res.send("Outstanding orders");
                return;
            }
        }

        // otherwise shut up shop
        const van = await Van.findByIdAndUpdate(req.user._id, {
            isOpen: false
        }, {useFindAndModify: false});

        res.send(van);
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.send("Failed to reset position");
    }
}

// Function that gets the number of pending orders from the DB and sends
// it back
const getNumberOutstanding = async (req, res) => {
    const numb = await findNumberOutstanding(req.user._id);
    res.send(numb.toString());
}

// A helper function to find how many orders there may be
const findNumberOutstanding = async (vanID) => {
    try {
        const numbOutstandingOrders = await order.countDocuments({van: vanID, status: "OUTSTANDING"});

        console.log(numbOutstandingOrders)

        return numbOutstandingOrders;
    }
    catch (err) {
        console.log(err);
        return ("Query failed");
    }
}

const createVan = async (req, res) => {
    const newVan = new Van({
        name: "Tasty Trailer",
        password: "hi123456",
        isOpen: true,
        locationString: "Melbourne",
        location: {
            type: "Point",
            coordinates: [-37.798675132553456, 144.96076578440946]
        }
        // name: req.body.name,
        // password: req.body.password
    });

    newVan.save((err, result) => {
        if (err){
            console.log(err)
            res.send(err);
        }
        return res.send(result);
    });
}

const changeVanPassword = async (req, res) => {
    // Find User from ID given
    try {
        const user = await Van.findById(req.user._id);
        // and update the password and save
        user.password = req.body.password;
        await user.save();
        res.send("Updated complete")
    }
    catch (err) {
        res.status(400);
        res.send("Query failed.")
    }
}

module.exports = {getVan, 
    getAllOpenVans, 
    getAllVans, 
    getVansOutstandingOrders, 
    getVansOrderHistory,
    getVansUncollectedOrders,
    getVanOneOrder,
    openVan, 
    closeVan, 
    createVan, 
    getNumberOutstanding,
    changeVanPassword
};
