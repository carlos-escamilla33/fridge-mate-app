const {findProfilesByAccountId, findProfileById} = require("../database/models/profileModel");


const getAllAccountProfiles = async (req, res, next) => {
    const {id} = req.user;
    try {
        const profiles = await findProfilesByAccountId(id);

        return res.send({
            profiles
        });
    } catch (err) {
        next(err);
    }
}

const getSingleProfile = async (req, res, next) => {
    const {id} = req.params;
    const accountId = req.user.id;
    try {
        const profile = await findProfileById(id);

        if (!profile) {
            return res.status(404).json({message: "Account not found"});
        }

        if (profile.account_id !== accountId) {
            return res.status(403).json({ 
                message: "Access denied - this profile doesn't belong to you" 
            });
        }

        res.send({
            profile
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllAccountProfiles,
    getSingleProfile,
}