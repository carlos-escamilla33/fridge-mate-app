const express = require("express");
// const jwt = require("jsonwebtoken");
const apiRouter = express.Router();
const {authRouter} = require("./routes/authRoutes");
const {accountsRouter} = require("./routes/accountRoutes");
const {profileRouter} = require("./routes/profileRouter");
const {itemsRouter} = require("./routes/itemsRouter");

apiRouter.use("/auth", authRouter);
apiRouter.use("/accounts", accountsRouter);
apiRouter.use("/profiles", profileRouter);
apiRouter.use("/items", itemsRouter);


module.exports = apiRouter;