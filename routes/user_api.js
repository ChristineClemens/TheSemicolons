require("dotenv").config();

const express = require("express");
const secured = require("../lib/middleware/secured");
const router = express.Router();

const book = require("../models/book");
const BookModel = new book();

const user = require("../models/user");
const UserModel = new user();

const message = require("../models/message");
const MessageModel = new message();

//Check database using auth_id to determine if a location exists.
//If a location value does not exist, POST new location to database.
router.post("/location", secured(), async function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    let location = await UserModel.getLocation(userProfile.user_id);
    if (!location) {
        UserModel.addLocation(userLocation);
    }
});

//Check database using auth_id to determine if a location exists.
//If a location value exists, PUT (replace) new location in database.
router.put("/location", secured(), async function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    let location = await UserModel.getLocation(userProfile.user_id);
    if (location) {
    UserModel.changeLocation(userLocation);
    }
});

//Check database using auth_id to determine if a location exists.
//If a location value exists, DELETE old location from database.
router.delete("/location", secured(), async function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    let location = await UserModel.getLocation(userProfile.user_id);
    if (location) {
    UserModel.removeLocation(userLocation);
    }
});

module.exports = router;