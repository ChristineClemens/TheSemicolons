const express = require('express');

const router = express.Router();
const secured = require('../lib/middleware/secured');
const Book = require('../models/book');

const BookModel = new Book();
const Message = require('../models/message');

const MessageModel = new Message()
const User = require('../models/user')

const UserModel = new User();

function conditionalTruncate(string) {
    if (string.length > 170) {
        return `${string.trim().substring(0, 170)}...`;
    }
    return string;
}

function parseBooks(bookList) {
    return bookList.map((book) => ({
        title: book.title,
        genre: book.genre,
        page_count: book.page_count,
        book_cover: book.book_cover,
        possession_id: book.possession_id,
        date_added: book.date_added,
        id: book.id,
        description: conditionalTruncate(book.description),
    }));
}

/* GET home page. */
router.get('/browse', secured(), async (req, res, next) => {
    console.log('browse page loaded');
    const { _raw, _json, ...userProfile } = req.user;
    // getting all the books in the db
    let allBooks = await BookModel.getAllBooks();
    allBooks = parseBooks(allBooks);
    const userInDB = await UserModel.getUserByID(userProfile.user_id);
    const messages = await MessageModel.getReceivedMessages(userInDB[0].id)

    const userCredits = await UserModel.checkCredits(userProfile.user_id)

    res.render('browse', {
        title: 'Browse',
        books: allBooks,
        messages,
        credits: userCredits,
    });
});

router.get('/browse/:condition/:query', async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const userInDB = await UserModel.getUserByID(userProfile.user_id);
    const { condition } = req.params;
    const { query } = req.params;
    console.log('getting books based on search for browse page ', condition, query);
    let allBooks = await BookModel.getBooksFuzzy(condition, query);
    allBooks = parseBooks(allBooks);
    const messages = await MessageModel.getReceivedMessages(userInDB[0].id)
    const userCredits = await UserModel.checkCredits(userProfile.user_id)

    res.render('browse', {
        title: 'Browse',
        books: allBooks,
        search: true,
        messages,
        credits: userCredits,
    });
});

router.get('/view_book/:id', async (req, res) => {
    console.log('Book information page loaded', req.params.id);
    const bookID = req.params.id;
    const bookInformation = await BookModel.getBookFromDBID(bookID);
    console.log('book info', bookInformation);
    if (bookInformation) {
        res.render('bookInformation', { book: bookInformation });
    } else {
        res.render('404');
    }
});

module.exports = router;
