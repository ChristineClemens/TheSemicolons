const orm = require('../config/orm');

class BookModel {
    async getBooks(column, search) {
        const db = new orm('mylibrary');
        const books = await db.selectSome('books', column, search);
        await db.close();
        return books;
    }

    async getBooksFuzzy(column, search) {
        const db = new orm('mylibrary');
        const books = await db.selectSomeFuzzy('books', column, search);
        await db.close();
        return books;
    }

    async getBookFromDBID(db_id) {
        const db = new orm('mylibrary');
        const book = (await db.selectSome('books', 'id', db_id))[0];
        await db.close();
        return book;
    }

    async getBooksFromAuthID(auth_id) {
        const db = new orm('mylibrary');
        const book = await db.leftJoinWhere('books', 'users', 'books.possession_id', 'users.id', 'users.auth_id', auth_id);
        await db.close();
        return book;
    }

    async getAllBooks() {
        // conditions is an object with column to search : value to find
        const db = new orm('mylibrary');
        const books = await db.selectAll('books');
        await db.close();
        return books;
    }

    async getBookAndUser(bookID) {
        const db = new orm('mylibrary');
        const book = await db.leftJoinWhere('books', 'users', 'books.possession_id', 'users.id', 'books.id', bookID);
        await db.close();
        return book;
    }

    async addBook(book) {
        // book is an object with title, author, etc
        const db = new orm('mylibrary');
        await db.insertOne('books', book);
        await db.close();
    }

    async updateBook(newUser, bookID) {
        const db = new orm('mylibrary');
        await db.updateOne('books', newUser, { id: bookID });
        await db.close();
    }

    async removeBook(bookID) {
        const db = new orm('mylibrary');
        await db.removeOne('books', { id: bookID });
        await db.close();
    }
}

module.exports = BookModel;
