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
    res.render("browse", {
        title: "Browse",
        books: allBooks,
    });
});

router.get("/browse/:condition/:query", async function (req, res) {
    let condition = req.params.condition;
    let query = req.params.query;
    console.log(`getting books based on search for browse page `, condition, query);
    let books = await BookModel.getBooksFuzzy(condition, query);
    res.render("browse", {
        title: "Browse",
        books: books,
        search: true,
    });
});

module.exports = router;
