const express = require("express");
const message = require("../models/message");
const MessageModel = new message();
const user = require("../models/user");
const UserModel = new user();
const book = require("../models/book")
const BookModel = new book()
const router = express.Router();
const secured = require("../lib/middleware/secured");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/send_request", secured(), async function (req, res) {
    console.log("New post request to send_request", req.body);
    const { _raw, _json, ...userProfile } = req.user;
    const userID = (await UserModel.getUserByID(userProfile.user_id))[0].id

    //Information about the owner of the book
    const bookInformation = (await BookModel.getBookAndUser(req.body.bookID))[0]
    const ownerID = bookInformation.possession_id

    //adding the message to the database
    await MessageModel.addMessage(userID, ownerID, req.body.messageText, req.body.bookID);
    res.status(200).send("message sent successfully")
    console.log("Message successfully saved")

});

module.exports = router;

//Identify requester and owner of book by getting their auth_id (getUserByID).
//Identify the book in question by getting the id of the book (auth_id of owner).
//Check database for existing messages between two users using their auth_id.
//POST new messages in the message chain in the message db, the oldest message appearing first.