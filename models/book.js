const orm = require("../config/orm")

class BookModel {
    async getBooksByUser(userID){
        let db = new orm("mylibrary")
        let userBooks = await db.selectSome("books", {user_added: userID})
        await db.close()
        return userBooks
    }
}