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

const fetch = require("node-fetch")

/* GET user profile page for my library. */
router.get("/newbook", secured(), async function (req, res, next) {
    console.log("New Book Page opened");
    const { _raw, _json, ...userProfile } = req.user;

    res.render("newBook", {title: "Add a book"})
    
});

router.get("/newBook/:bookTitle", secured(), async function(req, res) {
    console.log(req.params.bookTitle)  
    let bookTitle = req.params.bookTitle; 
    
    var APIKey = process.env.API_KEY;
    var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`).then(resp => resp.json());
    bookTitleSearch = bookTitleSearch.items
    
    bookTitleSearch = bookTitleSearch.map((book, index )=> ({
        title: book.volumeInfo.title,
        book_cover: book.volumeInfo.imageLinks.thumbnail, //Because this will loop each item in the array
        genre: book.volumeInfo.categories,
        author: book.volumeInfo.authors,
        id: index,
        description: book.volumeInfo.description
    }))

    console.log("Just to see if we grabbed the right data", bookTitleSearch)



    res.render("newBook",{books: bookTitleSearch})
});




module.exports = router;