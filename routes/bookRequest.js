const express = require("express");
const router = express.Router();
const secured = require("../lib/middleware/secured");

const book = require("../models/book");
const BookModel = new book();

const user = require("../models/user");
const UserModel = new user();

const message = require("../models/message");
const MessageModel = new message();

/* GET home page. */
router.get("/request_book/:bookID", secured(), async function (req, res, next) {
    console.log("request page loaded");

    const bookInformation = (await BookModel.getBookAndUser(req.params.bookID))[0]
    console.log("bookInformation", bookInformation)
    console.log(bookInformation.title)


    res.render("bookRequest", {
        title: "Request Page",
        bookTitle: bookInformation.title,
        meetupLocation: bookInformation.location,
        recipient: bookInformation.possession_id,
        bookID: req.params.bookID,
        bookCover: bookInformation.book_cover
    });
});

module.exports = router;
