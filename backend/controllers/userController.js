const passport = require("passport"), LocalStrategy = require("passport-local").Strategy, JwtStrategy = require("passport-jwt");
const User = require("../models/userModel");
const { order } = require("../models/orderModel");

// The signup strategy
passport.use("signup", new LocalStrategy({
        usernameField: "email",
        passReqToCallback : true
    },


    (req, username, password, done) => {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        // Select any matching emails from the database
        User.findOne({"email": req.body.email}, (err, existingUser) => {
            // See if errored
            if (err) {
                console.log("Error")
                return done(err);
            }
            
            // or if the email is already being used
            if (existingUser) {
                return done(null, false, {message: "User already exists"});
            }

            // Otherwise we're good
            else {
                newUser.save((err) => {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
            }
        })
}));

passport.use("login", new LocalStrategy({
    // Set the username to the "email" field
    usernameField: "email",
    },

    // Now get the data from the DB
    async function (email, password, done) {
        try {
            // Find the user then only return the user and password
            await User.findOne({email: email}, 'email password', async function (err, user) {
                // First see if errored
                if (err)
                    return done(err);

                // and for no user with that email
                if (!user) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }

                // See if the password matches
                const isMatch = await user.comparePassword(password);

                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }

                // Otherwise it's a valid password. Log the user in
                else {
                    return done(null, user, { message: "Logged in now" });
                }
            });
        } catch (err) {
            return done(err);
        }
        
    })
);

// For authenticating the user using the token
passport.use("user-jwt", new JwtStrategy.Strategy({
    jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PASSPORT_KEY
}, (jwt_payload, done) => {
    // Search for the user
    User.findOne({"email": jwt_payload.body._id}, (err, user)  => {
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

const getUsersOrder = async (req, res) => {
    try {
        const result = await order.find({customer: req.params.id, status: { $ne: "CANCELLED" } });
        res.send(result);
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.send("Query failed, no item with ID");
    }
}
const getUsersOrderPending = async (req, res) => {
    try {
        const result = await order.findOneAndUpdate({
            customer: req.user._id, 
            status: "PENDING"
        }, {van: req.params.van});

        res.send(result);
    }
    catch (err) {
        res.status(400);
        res.send("Query failed, no item with ID :(");
    }
}

const getUserInfo = async (req, res) => {
    // Just get the user info, such as name & past order list
    try {
        const deets = await User.findById(req.user._id);
        res.send(deets);
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.send("Query failed");
    }
}

const changeUserFirstName = async (req, res) => {
    // Find User from ID given
    try {
        console.log(req.params.firstName);
        await User.updateOne({_id: req.user._id}, {$set: {firstName: req.params.firstName}});
        res.send("Updated complete")
    }
    catch (err) {
        res.status(400);
        res.send("Query failed.")
    }
}

const changeUserLastName = async (req, res) => {
    // Find User from ID given
    try {
        await User.updateOne({_id: req.user._id}, {$set: {lastName: req.params.lastName}});
        res.send("Updated complete")
    }
    catch (err) {
        res.status(400);
        res.send("Query failed.")
    }
}

const changeUserPassword = async (req, res) => {
    // Find User from ID given
    try {
        const user = await User.findById(req.user._id);
        // and update the password and save
        user.password = req.params.password;
        await user.save();
        res.send("Updated complete")
    }
    catch (err) {
        res.status(400);
        res.send("Query failed.")
    }
}

module.exports = {getUsersOrder, getUsersOrderPending, getUserInfo, changeUserFirstName, changeUserLastName, changeUserPassword};
