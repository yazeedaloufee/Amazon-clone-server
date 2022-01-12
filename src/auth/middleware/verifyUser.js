"use strict";
const User = require("../models/users");

module.exports = async (req, res, next) => {
    if (!req.body) {
        next("request body does not exist");
        return;
    }
    try {
        console.log('inside verify user',req.body)
        const user = await User.verifyUserExists(req.body.username);
        if (!user) {
            next();
            return;
        } else {
            res.status(406).json({
                status: 406,
                message: "username already exists",
            });
        }
    } catch(error) {
        next(error.message);
    }
};
