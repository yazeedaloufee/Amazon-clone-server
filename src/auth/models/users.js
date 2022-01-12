"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
});

userSchema.virtual("token").get(function () {
    let tokenObject = {
        username: this.username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    console.log(process.env.SECRET);
    let token = jwt.sign(tokenObject, process.env.SECRET);
    return token;
});

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.statics.authenticateBasic = async function (username, password) {
    try {
        const user = await this.findOne({ username });
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            return user;
        } else {
            throw new Error("Invalid user!");
        }
    } catch (err) {
        throw new Error(err.message);
    }
};
userSchema.statics.authenticateBearer = async function (token) {
    try {
        const payload = jwt.verify(token, process.env.SECRET);
        const user = await this.findOne({
            username: payload.username,
        });
        if (user) {
            return user;
        } else {
            throw new Error("Invalid username from token");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
userSchema.statics.verifyUserExists = async function (username) {
    try {
        const user = await this.findOne({ username });
        if (user) {
            return user;
        } else {
          return null; 
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
module.exports = mongoose.model("User", userSchema);
