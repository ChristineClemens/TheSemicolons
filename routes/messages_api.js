const express = require('express');
const Message = require('../models/message');

const MessageModel = new Message();
const User = require('../models/user');

const UserModel = new User();
const Book = require('../models/book');

const BookModel = new Book();
const router = express.Router();
const secured = require('../lib/middleware/secured');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/send_message', secured(), async (req, res) => {
    console.log('New post request to send_message', req.body);
    const { _raw, _json, ...userProfile } = req.user;
    const userID = (await UserModel.getUserByID(userProfile.user_id))[0].id;
    const bookInformation = (await BookModel.getBookAndUser(req.body.bookID))[0];

    // If this is a message from us, we can maybe render it differently
    // We could add a new column to messages with a boolean, for now I'm just adding something to watch for in the form of ***
    if (req.body.serverMessage) {
        console.log('Server message')
        const ownerID = bookInformation.possession_id;
        await MessageModel.addMessage(ownerID, userID, `***\n${req.body.messageText}\n***`, req.body.bookID);
        res.status(200).send('message sent successfully');

        // removing a credit because they've made a request

        const userCredits = await UserModel.checkCredits(userProfile.user_id);

        await UserModel.addCredits(userCredits - 1, userProfile.user_id);

        return;
    }
    if (req.body.initialMessage) {
        console.log('book request message')
        const ownerID = bookInformation.possession_id;
        await MessageModel.addMessage(ownerID, userID, req.body.messageText, req.body.bookID);
        res.status(200).send('message sent successfully');
        console.log('Message successfully saved');
        return;
    }

    // adding the message to the database
    await MessageModel.addMessage(req.body.recipientID, userID, req.body.messageText, req.body.bookID);
    res.status(200).send('message sent successfully');
    console.log('Message successfully saved');
});

module.exports = router;

// Identify requester and owner of book by getting their auth_id (getUserByID).
// Identify the book in question by getting the id of the book (auth_id of owner).
// Check database for existing messages between two users using their auth_id.
// POST new messages in the message chain in the message db, the oldest message appearing first.
