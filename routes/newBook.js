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

router.get("/newbook", secured(), async function (req, res, next) {
    console.log("New Book Page opened");
    const { _raw, _json, ...userProfile } = req.user;
    let userCredits = await UserModel.checkCredits(userProfile.user_id)

    res.render("newBook", {title: "Add a book", credits: userCredits})
    
});

router.get("/newBook/:bookTitle", secured(), async function(req, res) {

    let bookTitle = req.params.bookTitle; 
    var APIKey = process.env.API_KEY;
    var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`).then(resp => resp.json());
    bookTitleSearch = bookTitleSearch.items

    bookTitleSearch = bookTitleSearch.map((book, index )=> ({
        title: book.volumeInfo.title,
        book_cover: book.volumeInfo.imageLinks.thumbnail,
        genre: book.volumeInfo.categories,
        author: book.volumeInfo.authors,// but I didn't see on other js files
        id: index,
        description: conditionalTruncate(String(book.volumeInfo.description)),
        
    }))
    
    res.render("newBook",{books: bookTitleSearch})
});

function conditionalTruncate(string) {
    console.log("The string should be here", string) //does that work?
    if (string){
    if (string.length > 200) {
        return string.trim().substring(0, 200) + "..."; //try now?
    }
    return string
}
}

module.exports = router;