/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
require('dotenv').config();

const express = require('express');
const secured = require('../lib/middleware/secured');

const router = express.Router();

const Book = require('../models/book');

const BookModel = new Book();

const User = require('../models/user');

const UserModel = new User();

const Message = require('../models/message');

const MessageModel = new Message();

// Retrieve information from the database to be organized and rendered in your Inbox.
// Using this information, you can open your collection of messages chains.
function onlyUniqueSenders(value, index, self) {
    return self.indexOf(value) === index;
}

router.get('/inbox', secured(), async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const user = await UserModel.getUserDBIDByAuthID(userProfile.user_id);
    let messages = await MessageModel.getReceivedMessages(user);
    messages = messages.map((message) => message.sender_id);
    const uniqueSenders = messages.filter(onlyUniqueSenders);
    const uniqueSenderNames = [];
    for (let i = 0; i < uniqueSenders.length; i++) {
        const sender = uniqueSenders[i];
        const senderName = await UserModel.getUsernameByDBID(sender);
        uniqueSenderNames.push({ id: sender, name: senderName || 'Unnamed User' });
    }

    // checking credits
    const userCredits = await UserModel.checkCredits(userProfile.user_id);

    res.render('messages', {
        messages: uniqueSenderNames,
        credits: userCredits,
    });
});

// Retrieve information from the database with one individual that will be rendered as a message chain.
// Using this information, you can open and view a single message chain.
// Here, you can send and receive messages.
router.get('/inbox/:sender_id', secured(), async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const user = await UserModel.getUserDBIDByAuthID(userProfile.user_id);
    const messageChain = await MessageModel.getSharedMessages(user, req.params.sender_id);
    console.log('messageChain', messageChain)
    if (messageChain.length === 0) {
        // No message chain
        res.render('404');
        return;
    }
    const recipientName = await UserModel.getUsernameByDBID(messageChain[0].recipient_id);
    const senderName = await UserModel.getUsernameByDBID(messageChain[0].sender_id);

    const conversationMembers = [messageChain[0].sender_id, messageChain[0].recipient_id];
    const personYouAreTalkingTo = conversationMembers.filter((item) => item != user)[0];

    const messageArray = [];
    for (let i = 0; i < messageChain.length; i++) {
        const message = messageChain[i];
        const messageSenderName = await UserModel.getUsernameByDBID(message.sender_id);
        messageArray.push({
            message: message.message_text,
            youReply: message.sender_id === user,
            name: messageSenderName || 'Unnamed User',
        });
    }
    const bookRequested = await BookModel.getBookFromDBID(messageChain[0].book_requested_id);

    const userCredits = await UserModel.checkCredits(userProfile.user_id);

    res.render('innerchat', {
        recipientName,
        senderName,
        recipientID: personYouAreTalkingTo,
        bookCover: bookRequested.book_cover,
        bookTitle: bookRequested.title,
        bookAuthor: bookRequested.author,
        messageChain: messageArray,
        credits: userCredits,
        bookID: messageChain[0].book_requested_id,
    });
});

module.exports = router;
