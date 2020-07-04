const express = require("express");
const secured = require("../lib/middleware/secured");
const router = express.Router();

/* GET user profile page for my library. */
router.get("/mylibrary", secured(), function (req, res, next) {
    console.log("MyLibrary Page opened")
    const { _raw, _json, ...userProfile } = req.user;
    let userName = userProfile.name.givenName || userProfile.displayName;
    res.render("mylibrary", {
        userProfile: JSON.stringify(userProfile, null, 2),
        userName: userName,
        title: "My Library",
    });
});

module.exports = router;



//JAMES, LOOK WHAT WE DID.
var APIKey = "AIzaSyAVDdcFdW0ng8X7gOa1ODlAlSmCmrhtFQE";

//Define title input as API call.
async function addBook() {
    var inputBookTitle = document.querySelector("#submitTitle").value.split(" ").join("+").toLowerCase();
    var bookTitleSearch = `https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`;

    //Performed a fetch request to retrieve information about an individual volume.
    await fetch (bookTitleSearch)
    .then (response => response.json())
    .then(data => {
        console.log(data);

    //Collected and defined information as a result of the API call.
    var bookInfo = {
        title: `${data.items[0].volumeInfo.title}`,
        author: `${data.items[0].volumeInfo.authors}`,
        genre: `${data.items[0].volumeInfo.categories}`,
        description: `${data.items[0].volumeInfo.description}`,
        page_count: `${data.items[0].volumeInfo.pageCount}`,
        book_cover: `${data.items[0].volumeInfo.imageLinks.thumbnail}`
    } 

    //Inserted new book information into the books table.
    var sql = `INSERT INTO books (title, author, genre, description, page_count, book_cover) 
    VALUES (${bookInfo.title}, ${bookInfo.author}, ${bookInfo.genre}, ${bookInfo.description}, ${bookInfo.page_count}, ${bookInfo.book_cover})`
})};