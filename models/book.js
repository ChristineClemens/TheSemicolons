const orm = require("../config/orm");

class BookModel {
    async getBooks(column, search) {
        let db = new orm("mylibrary");
        let books = await db.selectSome("books", column, search);
        await db.close();
        return books;
    }
    
    async getBooksFuzzy(column, search) {
        let db = new orm("mylibrary");
        let books = await db.selectSomeFuzzy("books", column, search);
        await db.close();
        return books;
    }

    async getBookFromDBID(db_id) {
        let db = new orm("mylibrary");
        let book = (await db.selectSome("books", "id", db_id))[0];
        await db.close();
        return book;
    }

    async getBooksFromAuthID(auth_id) {
        let db = new orm("mylibrary");
        let book = await db.leftJoinWhere("books", "users", "books.possession_id", "users.id", "users.auth_id", auth_id);
        await db.close();
        return book;
    }

    async getAllBooks() {
        //conditions is an object with column to search : value to find
        let db = new orm("mylibrary");
        let books = await db.selectAll("books");
        await db.close();
        return books;
    }

    async getBookAndUser(bookID) {
        let db = new orm("mylibrary");
        let book = await db.leftJoinWhere("books", "users", "books.possession_id", "users.id", "books.id", bookID);
        await db.close();
        return book;
    }

    async addBook(book) {
        //book is an object with title, author, etc
        let db = new orm("mylibrary");
        await db.insertOne("books", book);
        await db.close();
    }

    async updateBook(newUser, bookID) {
        let db = new orm("mylibrary");
        await db.updateOne("books", newUser, { id: bookID });
        await db.close();
    }
    async removeBook(bookID) {
        let db = new orm("mylibrary");
        await db.removeOne("books", { id: bookID });
        await db.close();
    }
}

module.exports = BookModel;
