const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");


// generate the router
const userRouter = express.Router();
const userController = require("../controllers/userController");

// A similar kind of logic to the login post,
// but creates a new User on the DB
userRouter.post("/create", (req, res, next) => {
    passport.authenticate("signup", async (err, user, info) => {
        try {
            // Check for server errors
            if (err) {
                const error = new Error("An Error has occurred");
                return next(error);
            }

            // This probably means that the user has an account
            if (!user) {
                res.status(409); // Conflict
                return next();
            }   

            // Store the user's details using the req.login
            req.login(user, {session: false}, async (error) => {
                if (error)
                    return next(error);
                
                    const body = {_id: user.email};

                    const token = jwt.sign({body}, process.env.PASSPORT_KEY);

                    res.status(200);

                    // and send the token 
                    res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"https://devdogs.herokuapp.com"});
                    return res.json(token);
            })
        } catch (err) {
            return next (err);
        }
    })(req, res, next);
});

// The route for logging in the user
userRouter.post("/login", function(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
        try {
            // Check for server errors
            if (err) {
                const error = new Error("An Error has occurred");
                return next(error);
            }
            // Send if not valid combination of username/password
            if (!user) {
                res.status(200);
                res.send(false);
                return next();
            }   

            // Store the user's details using the req.login
            req.login(user, {session: false}, async (error) => {
                if (error)
                    return next(error);
                
                    const body = {_id: user.email};

                    const token = jwt.sign({body}, process.env.PASSPORT_KEY);

                    res.status(200);

                    // and send the token 
                    res.cookie('user-jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"https://devdogs.herokuapp.com"});
                    return res.json(token);
            })
        } catch (err) {
            console.log(err)
            return next (err);
        }
    })(req, res, next);
});

// And the route for logging the user out
userRouter.post("/logout", function(req, res) {
    passport.authenticate("user-jwt", {session: false}),
    req.logout();
    res.redirect("/");
});

// Gets the user's details
userRouter.get("/info", 
    passport.authenticate("user-jwt", {session: false}),
    userController.getUserInfo
);

// Gets the user's order
userRouter.get("/getorders/:id", userController.getUsersOrder);

// get users pending order
userRouter.get("/getpending/:van",
    passport.authenticate("user-jwt", {session: false}),
    userController.getUsersOrderPending
);

// change first name of a user
userRouter.get("/change-firstname/:firstName", 
    passport.authenticate("user-jwt", {session: false}),
    userController.changeUserFirstName
);

// change last name of a user
userRouter.get("/change-lastname/:lastName", 
    passport.authenticate("user-jwt", {session: false}),
    userController.changeUserLastName
);

// change password of a user
userRouter.get("/change-password/:password", 
    passport.authenticate("user-jwt", {session: false}),
    userController.changeUserPassword
);

module.exports = userRouter;
