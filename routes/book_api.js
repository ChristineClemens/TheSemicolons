require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const book = require("../models/book");
const BookModel = new book();
const user = require("../models/user");
const UserModel = new user();
const router = express.Router();
const secured = require("../lib/middleware/secured");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
<<<<<<< HEAD
=======


>>>>>>> master
router.get("/books/GBooks/:title/", async function (req, res) {
    var inputBookTitle = req.params.title;
    var APIKey = process.env.API_KEY;
    var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`).then(resp => resp.json());
    res.status(200).send(JSON.stringify(bookTitleSearch))
});
//add book to db
router.post("/books", secured(), async function (req, res) {
    console.log("Posting book ", req.body.book);
    const { _raw, _json, ...userProfile } = req.user;
    const userID = (await UserModel.getUserByID(userProfile.user_id))[0].id; //This checks the database and gets the ID in our SQL database of the current user, so we can define the book as being "theirs"
    if ("id" in req.body) {
        //We might need to rerun the google books API search, because we don't have it "saved" or anything
        //Then we can use the index of the result inside that to choose it
        let bookTitle = req.body.originalSearch
        let bookID = req.body.id
        let APIKey = process.env.API_KEY
        var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`).then(resp => resp.json());
        let bookInfo = bookTitleSearch.items[bookID]
        const userID = (await UserModel.getUserByID(userProfile.user_id))[0].id;
        if ("book" in req.body) {
            //JAMES, LOOK WHAT WE DID.
            var APIKey = process.env.API_KEY;
    
            var inputBookTitle = req.body.book.title;
            var bookTitleSearch = `https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`;
    
            //Performed a fetch request to retrieve information about an individual volume.
            let bookInfo = await fetch(bookTitleSearch)
                .then((response) => response.json())
                .then((data) => {
        await BookModel.addBook({
            title: bookInfo.volumeInfo.title,
            author: bookInfo.volumeInfo.authors,
            genre: bookInfo.volumeInfo.categories,
            description: bookInfo.volumeInfo.description,
            page_count: bookInfo.volumeInfo.pageCount,
            book_cover: bookInfo.volumeInfo.imageLinks.thumbnail,
            possession_id: userID,
        });
        res.status(200).send("Book added");
    } else {
        res.status(400).send("failed to post book");
        console.log("There wasn't a book in the request body, so it wasn't added");
    } 

});



//get all the books in the db
router.get("/books", async function (req, res) {
    console.log(`getting all books to make sure this works please`);
    let books = await BookModel.getAllBooks();
    res.status(200).send(JSON.stringify(books));
});

//get books based on condition
router.get("/booksearch/:condition/:query", async function (req, res) {
    let condition = req.params.condition;
    let query = req.params.query;
    console.log(`getting books based on search `, condition, query);
    let books = await BookModel.getBooks(condition, query);
    res.status(200).send(JSON.stringify(books));
});

//getting user's books

//delete the book
router.delete("/books/:id", async function (req, res) {
    console.log(`removing book`, req.params.id);
    await BookModel.removeBook(req.params.id);
    res.status(200).send("Book deleted");
});

module.exports = router;
