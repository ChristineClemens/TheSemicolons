require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const secured = require('../lib/middleware/secured');

const router = express.Router();

const User = require('../models/user');

const UserModel = new User();

function conditionalTruncateDescription(string) {
    let returnString;
    if (!string.description) {
        returnString = 'No description found';
    } else {
        returnString = string.description;
    }
    if (returnString.length > 170) {
        return `${returnString.trim().substring(0, 170)}...`;
    }
    return returnString;
}

router.get('/newbook', secured(), async (req, res, next) => {
    console.log('New Book Page opened');
    const { _raw, _json, ...userProfile } = req.user;
    const userCredits = await UserModel.checkCredits(userProfile.user_id);

    res.render('newBook', { title: 'Add a book', credits: userCredits });
});

router.get('/newBook/:bookTitle', secured(), async (req, res) => {
    console.log(`New book page opened for ${req.params.bookTitle}`);
    const { bookTitle } = req.params;
    const APIKey = process.env.API_KEY;
    let bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`)
        .then((resp) => resp.json())
        .then((rep) => rep.items);

    bookTitleSearch = bookTitleSearch.map((book, index) => {
        if (book.volumeInfo.imageLinks && book.volumeInfo) {
            return {
                title: String(book.volumeInfo.title),
                book_cover: book.volumeInfo.imageLinks ? String(book.volumeInfo.imageLinks.thumbnail) : '',
                genre: String(book.volumeInfo.categories),
                author: String(book.volumeInfo.authors),
                id: index,
                description: conditionalTruncateDescription(book.volumeInfo),
            };
        }
        return null;
    });

    bookTitleSearch = bookTitleSearch.filter((item) => item);

    res.render('newBook', { books: bookTitleSearch });
});

module.exports = router;
