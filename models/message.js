const orm = require("../config/orm");

class MessageModel {
    async getAllMessages() {
        let db = new orm("mylibrary");
        let allmessages = await db.selectAll("messages");
        await db.close();
        return allmessages;
    }
    async removeMessage(messageID) {
        let db = new orm("mylibrary");
        await db.removeOne("messages", { id: messageID });
        await db.close();
        return true
    }
    

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
        let sharedMessages = await db.innerJoinSorted(
            "users",
            "messages",
            "users.id",
            "messages.recipient_id",
            "date_added"
        );
        sharedMessages = sharedMessages.filter(function (message) {
            return (
                (message.sender_id == senderID && message.recipient_id == userID) ||
                (message.recipient_id == senderID && message.sender_id == userID)
            );
        });
        await db.close();
        return sharedMessages;
    }

    //getAllBookMessages that retrieves all messages about a specific book.
    async getAllBookMessages(userID, bookID) {
        let db = new orm("mylibrary");
        let bookMessages = await db.selectSomeBetter("messages", "recipient_id", userID, "book_requested_id", bookID);
        console.log(bookMessages);
        await db.close();
        return bookMessages;
    }

    //getSharedBookMessages that filters messages between users that share a book id.
    async getSharedBookMessages(userID, senderID, bookID) {
        let db = new orm("mylibrary");
        let sharedBookMessages = await db.innerJoinSorted(
            "users",
            "messages",
            "users.id",
            "messages.recipient_id",
            "date_added"
        );
        sharedBookMessages = sharedBookMessages.filter(function (bookMessage) {
            return (
                ((bookMessage.sender_id == senderID && bookMessage.recipient_id == userID) ||
                    (bookMessage.recipient_id == senderID && bookMessage.sender_id == userID)) &&
                bookMessage.book_requested_id == bookID
            );
        });
        console.log(sharedBookMessages);
        await db.close();
        return sharedBookMessages;
    }

    //addMessage that inserts message into the database with a date/timestamp (insertOne).
    async addMessage(recipientID, userID, message, bookID) {
        let db = new orm("mylibrary");
        let newMessage = await db.insertOne("messages", {
            recipient_id: recipientID,
            sender_id: userID,
            message_text: message,
            book_requested_id: bookID,
        });

        console.log(newMessage);
        await db.close();
        return newMessage;
    }
}

module.exports = MessageModel;
