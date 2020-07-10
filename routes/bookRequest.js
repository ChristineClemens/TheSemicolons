const express = require('express');

const router = express.Router();
const secured = require('../lib/middleware/secured');

const Book = require('../models/book');

const BookModel = new Book();

const User = require('../models/user');

const UserModel = new User();

const Message = require('../models/message');

const MessageModel = new Message();

/* GET home page. */
router.get('/request_book/:bookID', secured(), async (req, res, next) => {
    console.log('request page loaded');
    const { _raw, _json, ...userProfile } = req.user;

    const bookInformation = (await BookModel.getBookAndUser(req.params.bookID))[0]

    if (!bookInformation) {
        res.render('404', { title: '404 Incorrect Book ID' })
        return;
    }

    const userCredits = await UserModel.checkCredits(userProfile.user_id)
    if (userCredits <= 0) {
        res.render('creditswarning')
        return;
    }
    res.render('bookRequest', {
        title: 'Request Page',
        bookTitle: bookInformation.title,
        meetupLocation: bookInformation.location,
        recipient: bookInformation.possession_id,
        bookID: req.params.bookID,
        bookCover: bookInformation.book_cover,
        credits: userCredits,
    });
});

module.exports = router;
