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

//Retrieve information from the database to be organized and rendered in your Inbox.
//Using this information, you can open your collection of messages chains.
router.get("/inbox", secured(), async function (req, res) {
    const { _raw, _json, ...userProfile } = req.user;
    let user = await UserModel.getUserDBIDByAuthID(userProfile.user_id);
    let messages = await MessageModel.getReceivedMessages(user);
    messages = messages.map(message => (message.sender_id));
    uniqueSenders = messages.filter(onlyUniqueSenders);
    uniqueSenderNames = []
    for (let index = 0; index < uniqueSenders.length; index++) {
        const sender = uniqueSenders[index];
        const senderName = await UserModel.getUsernameByDBID(sender)
        uniqueSenderNames.push({id: sender, name: ((senderName) ? senderName : "Unnamed User")})
    }
    console.log(uniqueSenderNames);
    res.render("messages", {
        messages: uniqueSenderNames
    })
});

function onlyUniqueSenders(value, index, self) { 
    return self.indexOf(value) === index;
}

//Retrieve information from the database with one individual that will be rendered as a message chain.
//Using this information, you can open and view a single message chain.
//Here, you can send and receive messages.
router.get("/inbox/:sender_id", secured(), async function (req, res) {
    const { _raw, _json, ...userProfile } = req.user;
    let user = await UserModel.getUserDBIDByAuthID(userProfile.user_id);
    let messageChain = await MessageModel.getSharedMessages(user, req.params.sender_id);
    let bookRequested = await BookModel.getBookFromDBID(messageChain[0].book_requested_id);
    console.log(messageChain);
    res.render("innerchat", {
        bookCover: bookRequested.book_cover,
        bookTitle: bookRequested.title,
        bookAuthor: bookRequested.author,
        messageChain: messageChain
    }) 
});

module.exports = router;
