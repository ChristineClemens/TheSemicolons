const orm = require('../config/orm');

class MessageModel {
    async getAllMessages() {
        const db = new orm('mylibrary');
        const allmessages = await db.selectAll('messages');
        await db.close();
        return allmessages;
    }

    async removeMessage(messageID) {
        const db = new orm('mylibrary');
        await db.removeOne('messages', { id: messageID });
        await db.close();
        return true
    }

    async getSentMessages(senderID) {
        const db = new orm('mylibrary');
        const sentMessages = await db.selectSome('messages', 'sender_id', senderID);
        await db.close();
        return sentMessages;
    }

    // getReceivedMessages affiliated with each sender id (selectSome).
    async getReceivedMessages(userID) {
        const db = new orm('mylibrary');
        const receivedMessages = await db.selectSome('messages', 'recipient_id', userID);
        await db.close();
        return receivedMessages;
    }

    // getSharedMessages that filters messages that share a sender and recipient id (res.filter...?).
    async getSharedMessages(userID, senderID) {
        const db = new orm('mylibrary');
        let sharedMessages = await db.innerJoinSorted(
            'users',
            'messages',
            'users.id',
            'messages.recipient_id',
            'date_added',
        );
        sharedMessages = sharedMessages.filter((message) => (
            (message.sender_id == senderID && message.recipient_id == userID)
                || (message.recipient_id == senderID && message.sender_id == userID)
        ));
        await db.close();
        return sharedMessages;
    }

    // getAllBookMessages that retrieves all messages about a specific book.
    async getAllBookMessages(userID, bookID) {
        const db = new orm('mylibrary');
        const bookMessages = await db.selectSomeBetter('messages', 'recipient_id', userID, 'book_requested_id', bookID);
        console.log(bookMessages);
        await db.close();
        return bookMessages;
    }

    // getSharedBookMessages that filters messages between users that share a book id.
    async getSharedBookMessages(userID, senderID, bookID) {
        const db = new orm('mylibrary');
        let sharedBookMessages = await db.innerJoinSorted(
            'users',
            'messages',
            'users.id',
            'messages.recipient_id',
            'date_added',
        );
        sharedBookMessages = sharedBookMessages.filter((bookMessage) => (
            ((bookMessage.sender_id == senderID && bookMessage.recipient_id == userID)
                    || (bookMessage.recipient_id == senderID && bookMessage.sender_id == userID))
                && bookMessage.book_requested_id == bookID
        ));
        console.log(sharedBookMessages);
        await db.close();
        return sharedBookMessages;
    }

    // addMessage that inserts message into the database with a date/timestamp (insertOne).
    async addMessage(recipientID, userID, message, bookID) {
        const db = new orm('mylibrary');
        const newMessage = await db.insertOne('messages', {
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
