const express = require("express");
const itemsRouter = express.Router();
const {authenticateToken} = require("../middleware/authToken");
const {getAllAccountItems, createSingleItem, getSingleItem} = require("../controllers/itemsController");

itemsRouter.use((req, res, next) => {
    console.log("A request has been made to /items");
    next();
});

itemsRouter.get("/", authenticateToken, getAllAccountItems);
itemsRouter.post("/", authenticateToken, createSingleItem);
itemsRouter.get("/:id", authenticateToken, getSingleItem);

module.exports = {
    itemsRouter
}