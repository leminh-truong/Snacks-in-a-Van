const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// adding the router
const vanRouter = express.Router()
const vanController = require("../controllers/vanController");


vanRouter.get("/", vanController.getAllVans);

vanRouter.post("/login", (req, res, next) => {
    passport.authenticate('van-login', async (err, van, info) => {
        
        try {
            if (err) {
                console.log(err);
                const error = new Error("An error has occurred");
                return next(error);
            }

            // Send unauthenticated if not a valid combination
            if (!van) {
                res.status(200) //unauthroised
                res.send("Invalid username or password");
                return next();
            }

            // otherwise store the user's details using the req.login
            req.login(van, {session: false}, async (error) => {
                if (error)
                    return next(error);
                
                    const body = {_id: van.name};

                    const token = jwt.sign({body}, process.env.PASSPORT_KEY);

                    // all is well
                    res.status(200);

                    res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"https://devdogs.herokuapp.com"});
                    return res.json(token);
            })
        } catch (err) {
            console.log(err);
            return next(err);
        }
    })(req, res, next);
});

// Only for testing purposes
vanRouter.post("/create", vanController.createVan);

vanRouter.get("/all-open", vanController.getAllOpenVans);

vanRouter.get("/number-outstanding",
    passport.authenticate("van-jwt", {session: false}),
    vanController.getNumberOutstanding
)

vanRouter.get("/info", 
    passport.authenticate("van-jwt", {session: false}),
    vanController.getVan
);

vanRouter.get("/outstanding-orders", 
    passport.authenticate("van-jwt", {session: false}),
    vanController.getVansOutstandingOrders
);

vanRouter.get("/order-history",
    passport.authenticate("van-jwt", {session: false}),
    vanController.getVansOrderHistory
);

vanRouter.get("/ready-orders",
    passport.authenticate("van-jwt", {session: false}),    
    vanController.getVansUncollectedOrders
);

vanRouter.get("/ready-orders/:orderid", 
    passport.authenticate("van-jwt", {session: false}),
    vanController.getVanOneOrder
);

vanRouter.get("/order-history/:orderid", 
    passport.authenticate("van-jwt", {session: false}),
    vanController.getVanOneOrder
);

vanRouter.post("/open", 
    passport.authenticate("van-jwt", {session: false}),
    vanController.openVan);

vanRouter.post("/close",
    passport.authenticate("van-jwt", {session: false}),
    vanController.closeVan
);

vanRouter.post("/change-password", 
    passport.authenticate("van-jwt", {session: false}),
    vanController.changeVanPassword
);

// and export the router
module.exports = vanRouter;