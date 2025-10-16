const express = require("express");
const authRouter = express.Router();
const {register, login, forgotPassword, resetPassword, refresh} = require("../controllers/authController");
const {authenticateToken} = require("../middleware/authToken");

authRouter.use((req, res, next) => {
    console.log("A request has been made to /auth");

    next();
});

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/refresh", refresh);

module.exports = {
    authRouter
}