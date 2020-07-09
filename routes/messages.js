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
    for (let i = 0; i < uniqueSenders.length; i++) {
        const sender = uniqueSenders[i];
        const senderName = await UserModel.getUsernameByDBID(sender)
        uniqueSenderNames.push({id: sender, name: ((senderName) ? senderName : "Unnamed User")})
    }
    
    //checking credits
    let userCredits = await UserModel.checkCredits(userProfile.user_id)


    res.render("messages", {
        messages: uniqueSenderNames,
        credits: userCredits
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
    const recipientName = await UserModel.getUsernameByDBID(messageChain[0].recipient_id);
    const senderName = await UserModel.getUsernameByDBID(messageChain[0].sender_id);
    let messageArray = []; 
    for (let i = 0; i < messageChain.length; i++) {
        const message = messageChain[i]; 
        const senderName = await UserModel.getUsernameByDBID(message.sender_id);
        messageArray.push({
            message: message.message_text,
            youReply: (message.sender_id === user),
            name: ((senderName) ? senderName : "Unnamed User")
        }); 
    }
    let bookRequested = await BookModel.getBookFromDBID(messageChain[0].book_requested_id);
    
    let userCredits = await UserModel.checkCredits(userProfile.user_id)

    res.render("innerchat", {
        recipientName: recipientName,
        senderName: senderName,
        recipientID: messageChain[0].recipient_id,
        bookCover: bookRequested.book_cover,
        bookTitle: bookRequested.title,
        bookAuthor: bookRequested.author,
        messageChain: messageArray,
        credits: userCredits,
        bookID: messageChain[0].book_requested_id,
        
    }) 
});

module.exports = router;
