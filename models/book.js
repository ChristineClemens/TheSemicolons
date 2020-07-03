const orm = require("../config/orm")

class BookModel {
    async getBooksByUser(userID){
        let db = new orm("mylibrary")
        let userBooks = await db.selectSome("books", {user_added: userID})
        await db.close()
        return userBooks
    }

    async getBooksByGenre(genreName){
        let db = new orm("mylibrary")
        let genreBooks = await db.selectSome("books", {genre: genreName})
        await db.close()
        return genreBooks
    }
    async getBooksByTitle(bookTitle){
        let db = new orm("mylibrary")
        let books = await db.selectSome("books", {title: bookTitle})
        await db.close()
        return books
    }
    async getBooksByAuthor(bookAuthor){
        let db = new orm("mylibrary")
        let books = await db.selectSome("books", {author: bookAuthor})
        await db.close()
        return books
    }
}