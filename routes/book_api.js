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

router.get("/books/GBooks/:title/", async function (req, res) {
    var inputBookTitle = req.params.title;
    var APIKey = process.env.API_KEY;
    var bookTitleSearch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`).then(resp => resp.json());
    console.log("bookTitleSearch", bookTitleSearch)
    res.status(200).send(JSON.stringify(bookTitleSearch))
});

//add book to db
router.post("/books", secured(), async function (req, res) {
    console.log("Posting book ", req.body.book);
    const { _raw, _json, ...userProfile } = req.user;
    const userID = (await UserModel.getUserByID(userProfile.user_id))[0].id;
    console.log("userID", userID);
    if ("book" in req.body) {
        //JAMES, LOOK WHAT WE DID.
        var APIKey = process.env.API_KEY;

        var inputBookTitle = req.body.book.title;
        var bookTitleSearch = `https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`;

        //Performed a fetch request to retrieve information about an individual volume.
        let bookInfo = await fetch(bookTitleSearch)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                //Collected and defined information as a result of the API call.
                return {
                    title: `${data.items[0].volumeInfo.title}`,
                    author: `${data.items[0].volumeInfo.authors}`,
                    genre: `${data.items[0].volumeInfo.categories}`,
                    description: `${data.items[0].volumeInfo.description}`,
                    page_count: `${data.items[0].volumeInfo.pageCount}`,
                    book_cover: `${data.items[0].volumeInfo.imageLinks.thumbnail}`,
                };
            });
        await BookModel.addBook({
            title: bookInfo.title,
            author: bookInfo.author,
            genre: bookInfo.genre,
            description: bookInfo.description,
            page_count: bookInfo.page_count,
            book_cover: bookInfo.book_cover,
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
