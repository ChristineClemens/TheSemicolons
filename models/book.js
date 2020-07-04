const orm = require("../config/orm");

class BookModel {
    async getBooks(column, search){
        //conditions is an object with column to search : value to find
        let db = new orm("mylibrary");
        let books = await db.selectSome("books", column, search);
        await db.close();
        return books;
    }
    async getAllBooks(){
        //conditions is an object with column to search : value to find
        let db = new orm("mylibrary");
        let books = await db.selectAll("books");
        await db.close();
        return books;
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
    }
    async removeBook(bookID){
        let db = new orm("mylibrary")
        await db.removeOne("books", {id: bookID})
    }
}

module.exports = BookModel