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

/* GET user profile page for my library. */
router.get("/mylibrary", secured(), async function (req, res, next) {
    console.log("MyLibrary Page opened");
    const { _raw, _json, ...userProfile } = req.user;
    let userName = userProfile.name.givenName || userProfile.displayName;

    //we want to check if this is a new user, if it is we add the user to the db and present a different page to them to welcome them
    //and add books.  We could even create a new page and redirect them to a different page entirely
    let userID = userProfile.user_id;

    //everytime new login, catch user id, check if user id in db
    let userInDB = await UserModel.getUserByID(userID);
    if (userInDB.length === 0) {
        //add the user to the db
        console.log("New user detected")
        UserModel.addUser({auth_id: userID});

        //check needed for location added before book entry or here

        //present user with some pretty page welcoming them and enabling them to add their first book?
        
        //or view books if that's the primary use case
        res.render("mylibrary", {
            userProfile: JSON.stringify(userProfile, null, 2),
            userName: userName,
            title: "My Library",
        });


    } else {
        let messages = await MessageModel.getMessages(userID)
        console.log("messages ", messages)
        
        res.render("mylibrary", {
            userProfile: JSON.stringify(userProfile, null, 2),
            userName: userName,
            title: "My Library",
        });
    }

    // if user id not in db, add to db and serve a page of welcome message / add books page?

    //if user id in db, serve up their library of books

    //we want a list of all their books to pass into the page
    // let userBooks = BookModel.getBooks("user_id", userID)
});

module.exports = router;

//JAMES, LOOK WHAT WE DID.
var APIKey = process.env.API_KEY;

//Define title input as API call.
async function addBook() {
    var inputBookTitle = document.querySelector("#submitTitle").value.split(" ").join("+").toLowerCase();
    var bookTitleSearch = `https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`;

    //Performed a fetch request to retrieve information about an individual volume.
    await fetch(bookTitleSearch)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            //Collected and defined information as a result of the API call.
            var bookInfo = {
                title: `${data.items[0].volumeInfo.title}`,
                author: `${data.items[0].volumeInfo.authors}`,
                genre: `${data.items[0].volumeInfo.categories}`,
                description: `${data.items[0].volumeInfo.description}`,
                page_count: `${data.items[0].volumeInfo.pageCount}`,
                book_cover: `${data.items[0].volumeInfo.imageLinks.thumbnail}`,
            };

            //Inserted new book information into the books table.
            var sql = `INSERT INTO books (title, author, genre, description, page_count, book_cover) 
    VALUES (${bookInfo.title}, ${bookInfo.author}, ${bookInfo.genre}, ${bookInfo.description}, 
    ${bookInfo.page_count}, ${bookInfo.book_cover})`;
        });
}
