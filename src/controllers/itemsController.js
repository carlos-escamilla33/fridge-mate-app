const {findItemsByAccountId, createItem} = require("../database/models/itemModel");
const Joi = require("joi");

const getAllAccountItems = async (req, res, next) => {
    try {
        const accountId = req.user.id;
        const items = findItemsByAccountId(accountId);

        return res.send({
            items
        });
    } catch (err) {
        next(err);
    }
}

const createSingleItem = async (req, res, next) => {
    try {
        const itemSchema = Joi.object({
        profileId: Joi.number().integer().positive().required(),
        recipeId: Joi.number().integer().optional(),
        foodName: Joi.string().min(2).max(100).required(),
        expirationDate: Joi.date().required(),
        ripenessLevel: Joi.string().min(3).max(30).required()
        });
        const {error, value} = itemSchema.validate(req.body);
        const accountId = req.user.id;

        if (error) {
            return res.status(400).json({error: error.details});
        }

        const {profileId, recipeId, foodName, expirationDate, ripenessLevel} = value;
        const item = await createItem(accountId, profileId, recipeId, foodName, expirationDate, ripenessLevel);

        return res.send({
            message: "item created successfully!",
            item
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllAccountItems,
    createSingleItem,
}