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

/* GET user profile page for my library. */
router.get("/newbook", secured(), async function (req, res, next) {
    console.log("New Book Page opened");
    const { _raw, _json, ...userProfile } = req.user;

    res.render("newBook", {title: "Add a book"})





    
});

module.exports = router;