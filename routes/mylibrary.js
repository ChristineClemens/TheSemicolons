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

/* GET user profile page for my library. */
router.get('/mylibrary', secured(), async (req, res, next) => {
    console.log('MyLibrary Page opened');
    const { _raw, _json, ...userProfile } = req.user;

    // we want to check if this is a new user, if it is we add the user to the db and present a different page to them to welcome them
    // and add books.  We could even create a new page and redirect them to a different page entirely
    const userID = userProfile.user_id;

    // everytime new login, catch user id, check if user id in db
    const userInDB = await UserModel.getUserByID(userID);
    if (userInDB.length === 0 || !userInDB[0].name) {
        // add the user to the db
        console.log('New user detected');
        if (userInDB.length === 0) {
            UserModel.addUser({ auth_id: userID });
        }

        // check needed for location added before book entry or here

        // present user with some pretty page welcoming them and enabling them to add their first book?

        // or view books if that's the primary use case
        res.render('newuser', {
            userProfile: JSON.stringify(userProfile, null, 2),
            title: 'Welcome!',
        });
    } else {
        let userName = await UserModel.getUsernameByID(userProfile.user_id);
        if (!userName) {
            userName = userProfile.name.givenName || userProfile.displayName;
        }
        let usersBooks = await BookModel.getBooks('possession_id', userInDB[0].id);
        usersBooks = parseBooks(usersBooks);
        const usercheckCredits = await UserModel.checkCredits(userID);

        const messages = MessageModel.getReceivedMessages(userInDB[0].id);

        res.render('mylibrary', {
            userProfile: JSON.stringify(userProfile, null, 2),
            userName,
            title: 'My Library',
            books: usersBooks,
            credits: usercheckCredits,
            messages,
        });
    }

    // if user id not in db, add to db and serve a page of welcome message / add books page?

    // if user id in db, serve up their library of books

    // we want a list of all their books to pass into the page
    // let userBooks = BookModel.getBooks("user_id", userID)
});

module.exports = router;
