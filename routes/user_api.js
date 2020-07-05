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



var userLocation = "";

router.post("/location", secured(), async function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    let location = await UserModel.getLocation(userProfile.user_id);
    if (!location) {
        addLocation();
    } else if ()
});

module.exports = router;