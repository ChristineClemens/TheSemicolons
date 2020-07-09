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

const fetch = require("node-fetch");

router.get("/newbook", secured(), async function (req, res, next) {
    console.log("New Book Page opened");
    const { _raw, _json, ...userProfile } = req.user;
    let userCredits = await UserModel.checkCredits(userProfile.user_id);

    res.render("newBook", { title: "Add a book", credits: userCredits });
});

router.get("/newBook/:bookTitle", secured(), async function (req, res) {
    console.log(`New book page opened for ${req.params.bookTitle}`);
    let bookTitle = req.params.bookTitle;
    var APIKey = process.env.API_KEY;
    var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`)
        .then((resp) => resp.json())
        .then((rep) => rep.items);
    // console.log(bookTitleSearch)
    // console.log("This should be only the volinfo", bookTitleSearch[0].volumeInfo.imageLinks.thumbnail);

    // for (let i = 0; i < bookTitleSearch.length; i++) {
    //     const book = bookTitleSearch[i];
    //     console.log("book", book)
    //     console.log(book.volumeInfo.imageLinks.thumbnail)
    // }

    bookTitleSearch = bookTitleSearch.map(function (book, index) {
        if (book.volumeInfo.imageLinks && book.volumeInfo) {
            return {
                title: String(book.volumeInfo.title),
                book_cover: book.volumeInfo.imageLinks ? String(book.volumeInfo.imageLinks.thumbnail) : "",
                genre: String(book.volumeInfo.categories),
                author: String(book.volumeInfo.authors),
                id: index,
                description: conditionalTruncate(String(book.volumeInfo.description)),
            };
        }
    });

    bookTitleSearch = bookTitleSearch.filter(item => (item))

    res.render("newBook", { books: bookTitleSearch });
});

function conditionalTruncate(string) {
    console.log("The string should be here", string);
    if (string) {
        if (string.length > 170) {
            return string.trim().substring(0, 170) + "...";
        }
        return string;
    }
}

module.exports = router;
