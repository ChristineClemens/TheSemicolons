const orm = require("../config/orm");

class MessageModel{
    
    async getSentMessages(senderID) {
        let db = new orm("mylibrary");
        let sentMessages = await db.selectSome("messages", "sender_id", senderID);
        await db.close();
        return sentMessages;
    }

    //getReceivedMessages affiliated with each sender id (selectSome).
    async getReceivedMessages(userID) {
        let db = new orm("mylibrary");
        let receivedMessages = await db.selectSome("messages", "recipient_id", userID);
        await db.close();
        return receivedMessages;
    }

    //getSharedMessages that filters messages that share a sender and recipient id (res.filter...?).
    async getSharedMessages(userID, senderID) {   
        let db = new orm("mylibrary");
        let sharedMessages = await db.innerJoinSorted("users", "messages", "users.id", "messages.recipient_id", "date_added");
        sharedMessages = sharedMessages.filter(function (message) {
            return ((message.sender_id == senderID && message.recipient_id == userID) || (message.recipient_id == senderID && message.sender_id == userID));
        })
        await db.close();
    }

    //getSharedBookMessages that filters messages that share a book id.
    async getSharedBookMessages(userID, senderID, bookID) {
        let db = new orm("mylibrary");
        let sharedBookMessages = await db.innerJoinSorted("users", "messages", "users.id", "messages.recipient_id", "date_added");
        sharedBookMessages = sharedBookMessages.filter(function (bookMessage) {
            return (((bookMessage.sender_id == senderID && bookMessage.recipient_id == userID) || (bookMessage.recipient_id == senderID && bookMessage.sender_id == userID)) && (bookMessage.book_requested_id == bookID));
        })
        console.log(sharedBookMessages);
        await db.close();
        return sharedBookMessages;
    }

    //addMessage that inserts message into the database with a date/timestamp (insertOne).
    async addMessage(senderID, userID, message, bookID) {
        let db = new orm("mylibrary");
        let newMessage = await db.insertOne("messages", {recipient_id: userID, sender_id: senderID, message_text: message, book_requested_id: bookID});
        console.log(newMessage);
        await db.close();
        return newMessage;
    }
};

//get("/inbox") -> Get every book that has a message in the table about it
//get("/inbox/:bookID") --> get every message about that book (req.params.bookID)
//get(/inbox/:bookID/:senderID") --> get every message about the book, and from a person

module.exports = MessageModel