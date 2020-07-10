require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const Book = require('../models/book');
const User = require('../models/user');
const Message = require('../models/message');
const secured = require('../lib/middleware/secured');

const BookModel = new Book();
const MessageModel = new Message();
const UserModel = new User();

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

function checkPresent(string) {
    if (string){
        return string
    }
    return "No description found"
}



router.get('/books/GBooks/:title/', async (req, res) => {
    const inputBookTitle = req.params.title;
    const APIKey = process.env.API_KEY;
    const bookTitleSearch = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}&appid=${APIKey}`,
    ).then((resp) => resp.json());
    res.status(200).send(JSON.stringify(bookTitleSearch));
});
// add book to db
router.post('/books', secured(), async (req, res) => {
    console.log('Posting book ', req.body.originalSearch);
    const { _raw, _json, ...userProfile } = req.user;
    const userID = (await UserModel.getUserByID(userProfile.user_id))[0].id;

    if ('id' in req.body) {
        // adding a credit
        const currentCredits = await UserModel.checkCredits(userProfile.user_id)
        await UserModel.addCredits(currentCredits + 1, userProfile.user_id);

        const bookTitle = req.body.originalSearch;
        const bookID = req.body.id;
        const APIKey = process.env.API_KEY;
        const bookTitleSearch = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&appid=${APIKey}`,
        ).then((resp) => resp.json());
        const bookInfo = bookTitleSearch.items[bookID];

        await BookModel.addBook({
            title: String(bookInfo.volumeInfo.title),
            author: String(bookInfo.volumeInfo.authors),
            genre: String(bookInfo.volumeInfo.categories),
            description: checkPresent(bookInfo.volumeInfo.description),
            page_count: String(bookInfo.volumeInfo.pageCount),
            book_cover: bookInfo.volumeInfo.imageLinks.thumbnail,
            possession_id: userID,
        });
        res.status(200).send('Book added');
    } else {
        res.status(400).send('failed to post book');
        console.log('There wasn\'t a book in the request body, so it wasn\'t added');
    }
});

// get all the books in the db
router.get('/books', async (req, res) => {
    const books = await BookModel.getAllBooks();
    res.status(200).send(JSON.stringify(books));
});

// get books based on condition
router.get('/booksearch/:condition/:query', async (req, res) => {
    const { condition } = req.params;
    const { query } = req.params;
    console.log('getting books based on search ', condition, query);
    const books = await BookModel.getBooks(condition, query);
    res.status(200).send(JSON.stringify(books));
});

// getting user's books

// delete the book
router.delete('/books/:id', async (req, res) => {
    console.log('removing book', req.params.id);

    // grab all the messages
    const allMessages = await MessageModel.getAllMessages();
    // check all the book_requested_id
    for (let i = 0; i < allMessages.length; i++) {
        const message = allMessages[i];
        if (message.book_requested_id === req.params.id) {
            await MessageModel.removeMessage(message.id);
        }
    }

    await BookModel.removeBook(req.params.id);
    res.status(200).send('Book deleted');
});

module.exports = router;
