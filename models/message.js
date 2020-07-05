const orm = require("../config/orm");

class MessageModel{
    async getMessages(userID){
        let db = new orm("mylibrary");
        let messages = await db.leftJoinWhere('messages', 'users', 'messages.recipient_id', 'users.id', 'users.auth_id', userID)
        await db.close()
        return messages
    }

    async addMessage(senderID, recipientID, message, bookID){
        let db = new orm("mylibrary");
        await db.insertOne("messages", {sender_id: senderID, recipient_id: recipientID, message_text: message, book_requested_id: bookID})
        await db.close()
    }

}




module.exports = MessageModel