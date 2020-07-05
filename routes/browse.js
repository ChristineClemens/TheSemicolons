const express = require("express");
const router = express.Router();
const secured = require("../lib/middleware/secured");
const book = require("../models/book");
const BookModel = new book();

/* GET home page. */
router.get("/browse", secured(), async function (req, res, next) {
    console.log("browse page loaded");

    //getting all the books in the db
    const allBooks = await BookModel.getAllBooks();
    console.log("allBooks", allBooks);

    res.render("browse", {
        title: "Browse Page",
        books: allBooks,
    });
});

module.exports = router;
