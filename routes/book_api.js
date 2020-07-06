const express = require("express");
const book = require("../models/book");
const BookModel = new book();
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//add book to db
router.post("/books", async function (req, res) {
    console.log("Posting book ", req.body)
    if ("book" in req.body) {
        await BookModel.addBook(req.body.book);
        res.status(200).send("Book added");
    } else {
        res.status(400).send("failed to post book");
        console.log("There wasn't a book in the request body, so it wasn't added")
    }
});

//get all the books in the db
router.get("/books", async function(req, res){
    console.log(`getting all books to make sure this works please`)
    let books = await BookModel.getAllBooks()
    res.status(200).send(JSON.stringify(books))
})

// router.get("/booksInfo/:title/:author", async function(req, res){

// })

//get books based on condition
// this doesn't work yet, figuring it out still
router.get("/booksearch/:condition/:query", async function(req, res){
    let condition = req.params.condition
    let query = req.params.query
    console.log(`getting books based on search `, condition, query)
    let books = await BookModel.getBooks(condition, query)
    res.status(200).send(JSON.stringify(books))
})

//getting user's books


//delete the book
router.delete("/books", async function(req, res){
    console.log(`removing book`, req.body)
    await BookModel.deleteOne(req.body.bookID)
    res.status(200).send("Book deleted")
})


module.exports = router