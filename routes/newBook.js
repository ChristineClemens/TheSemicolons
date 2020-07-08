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

//First page, where they enter a name for the book
//We send the user to a new page, that loads the response from GOOGLE BOOKS,
//On that page, there are all of the book options, and a button under each one they can click, that will send a message to the server to add that book


//So let's make that second page here, then we can go into handlebars and write the code that sends the user between them
//Because going to a URL in the browser is always a GET request, you'll want router.get("THE URL")
//And it should be a subdirectory of /newBook, using a parameter.  Parameters get passed in with :PARAMETERNAME, so /newBook/:bookTitle would allow us to 
//generate pages based on the bookTitle variable.  Then in the actual page we send them somewhere based on that.  Check out the browse.js route to see what I mean
//There we pass in a search string, two variables, and then render a page based on it.
//Do you know what I mean by the parameters getting passed in?  If not, we can do a console log and I can show you really quickly
router.get("/newBook/:bookTitle", secured(), async function(req, res) {
    console.log(req.params.bookTitle)  //req.params.WHATEVERTHEVARIABLENAMEIS is where we access the variable from the req (request) to the server
    //let's run it and pop into the browser to see it work.  Run node server.js, then in a browser go to localhost:3000/newBook/TestName yes I can see whatever I typed in 
    let bookTitle = req.params.bookTitle; 
    //I'd started this as an API call, which is a call to the server that returns something to a fetch instead of rendering a page.  I'm going to copy paste the stuff 
    //Christine and Shayanne made here for a second from that file
    var APIKey = process.env.API_KEY; //The api key for Google
    var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`).then(resp => resp.json());
    bookTitleSearch = bookTitleSearch.items
    // console.log("bookTitleSearch", bookTitleSearch) 
    //So now we have a list in JSON format of all of the books.  That's pretty much all we need
    //We can make is a little prettier, but Handlebars likes arrays.
    
    //We might want to make the variable names inside that nicer, we could always use a .Map
    bookTitleSearch = bookTitleSearch.map((book, index )=> ({
        title: book.volumeInfo.title,
        book_cover: book.volumeInfo.imageLinks.thumbnail, //Because this will loop each item in the array
        id: index
    }))

    console.log("Just to see if we grabbed the right data", bookTitleSearch)
    //I'm trying to figure out how nested the actual book information is haha.  I didn't work on this part at the start

    //THIS is what Christine and Shayanne figured out
    // title: `${data.items[0].volumeInfo.title}`,
    //                 author: `${data.items[0].volumeInfo.authors}`,
    //                 genre: `${data.items[0].volumeInfo.categories}`,
    //                 description: `${data.items[0].volumeInfo.description}`,
    //                 page_count: `${data.items[0].volumeInfo.pageCount}`,
    //                 book_cover: `${data.items[0].volumeInfo.imageLinks.thumbnail}`,
    // data.items[0].volumeInfo.title


    //Not in there, you only want to pass one variable with the list to handlebars, then it loops it
    res.render("newBook",{books: bookTitleSearch})
});




module.exports = router;