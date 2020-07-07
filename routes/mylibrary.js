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
    console.log("userInDB", userInDB)
    if (userInDB.length === 0 || !userInDB[0].name) {
        //add the user to the db
        console.log("New user detected");
        if (userInDB.length == 0) {
            UserModel.addUser({ auth_id: userID });
        }

        //check needed for location added before book entry or here

        //present user with some pretty page welcoming them and enabling them to add their first book?

        //or view books if that's the primary use case
        res.render("newuser", {
            userProfile: JSON.stringify(userProfile, null, 2),
            userName: userName,
            title: "Welcome!",
        });
    } else {
        let messages = await MessageModel.getMessages(userID);
        let usersBooks = await BookModel.getBooks("possession_id", userInDB[0].id);
        let usercheckCredits = await UserModel.checkCredits(userID);

        console.log("usersBooks", usersBooks);
        console.log("messages ", messages);

        res.render("mylibrary", {
            userProfile: JSON.stringify(userProfile, null, 2),
            userName: userName,
            title: "My Library",
            books: usersBooks,
            credits: usercheckCredits,
        });
    }

    // if user id not in db, add to db and serve a page of welcome message / add books page?

    //if user id in db, serve up their library of books

    //we want a list of all their books to pass into the page
    // let userBooks = BookModel.getBooks("user_id", userID)
});

module.exports = router;
