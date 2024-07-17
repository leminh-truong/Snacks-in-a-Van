const express = require('express');

const apiRouter = express.Router();

const menuRouter = require("./menuRouter");
const userRouter = require("./userRouter");
const vanRouter = require('./vanRouter');
const orderRouter = require('./orderRouter');

apiRouter.use("/user", userRouter);
apiRouter.use("/menu", menuRouter);
apiRouter.use("/van", vanRouter);
apiRouter.use("/order",orderRouter);

module.exports = apiRouter;