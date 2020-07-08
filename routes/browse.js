const express = require("express");
const router = express.Router();
const secured = require("../lib/middleware/secured");
const book = require("../models/book");
const BookModel = new book();
const message = require ("../models/message");
const MessageModel = new message()
const user = require("../models/user")
const UserModel = new user();

/* GET home page. */
router.get("/browse", secured(), async function (req, res, next) {
    console.log("browse page loaded");
    const { _raw, _json, ...userProfile } = req.user;
    //getting all the books in the db
    let allBooks = await BookModel.getAllBooks();
    allBooks = parseBooks(allBooks);
    let userInDB = await UserModel.getUserByID(userProfile.user_id);
    let messages =  await MessageModel.getReceivedMessages(userInDB[0].id)
    res.render("browse", {
        title: "Browse",
        books: allBooks,
        messages: messages
    });
});

router.get("/browse/:condition/:query", async function (req, res) {
    const { _raw, _json, ...userProfile } = req.user;
    let userInDB = await UserModel.getUserByID(userProfile.user_id);
    let condition = req.params.condition;
    let query = req.params.query;
    console.log(`getting books based on search for browse page `, condition, query);
    let allBooks = await BookModel.getBooksFuzzy(condition, query);
    allBooks = parseBooks(allBooks);
    let messages = MessageModel.getReceivedMessages(userInDB[0].id)

    res.render("browse", {
        title: "Browse",
        books: allBooks,
        search: true,
        messages: messages,
    });
});

router.get("/view_book/:id", async function (req, res) {
    console.log("Book information page loaded", req.params.id);
    let bookID = req.params.id;
    let bookInformation = await BookModel.getBookFromDBID(bookID);
    console.log("book info", bookInformation);
    if (bookInformation) {
        res.render("bookInformation", { book: bookInformation });
    } else {
        res.render("404");
    }
});

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

function conditionalTruncate(string) {
    if (string.length > 300) {
        return string.trim().substring(0, 300) + "...";
    }
    return string;
}

module.exports = router;
