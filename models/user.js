const orm = require('../config/orm');
const DB = require('../config/orm');

class UserModel {
    async getUserByID(userID) {
        const db = new orm('mylibrary');
        const user = await db.selectSome('users', 'auth_id', userID);
        await db.close();
        return user;
    }

    async getUserDBIDByAuthID(userID) {
        const db = new orm('mylibrary');
        const user = await db.selectSome('users', 'auth_id', userID);
        await db.close();
        return user[0].id;
    }

    async getUsernameByID(userID) {
        const db = new orm('mylibrary');
        const user = await db.selectSome('users', 'auth_id', userID);
        await db.close();
        if (user.length > 0) {
            return user[0].name;
        }
        console.log('When trying to get the name using getUsernameByID no result was returned')
    }

    async getUsernameByDBID(db_id) {
        const db = new orm('mylibrary');
        const user = await db.selectSome('users', 'id', db_id);
        await db.close();
        return user[0].name;
    }

    async addUser(user) {
        // user is an object
        const db = new orm('mylibrary');
        await db.insertOne('users', user);
        await db.close();
    }

    async updateName(name, userID) {
        const db = new orm('mylibrary')
        await db.updateOne('users', { name }, { auth_id: userID })
        await db.close()
    }

    // add credit
    async addCredits(userCredits, auth_id) {
        this.checkCredits(auth_id)
        const db = new orm('mylibrary')
        await db.updateOne('users', { credits: userCredits }, { auth_id })
        await db.close()
    }

    // remove credit
    async removeCredits(auth_id) {
        this.checkCredits(auth_id)
        const db = new orm('mylibrary')
        await db.updateOne('users', { credits: userCredits }, { auth_id })
        await db.close()
    }

    // get credits
    async checkCredits(auth_id) {
        const db = new orm('mylibrary')
        const credits = await db.selectSome('users', 'auth_id', auth_id)
        await db.close()
        return credits[0].credits
    }

    // retrieve location for pickup from database
    async getLocation(auth_id) {
        const db = new orm('mylibrary');
        const users = await db.selectSome('users', 'auth_id', auth_id);
        await db.close();
        return users[0].location;
    }

    // add location for pickup
    async addLocation(userLocation) {
        const db = new orm('mylibrary');
        await db.insertOne('users', { location: userLocation });
        await db.close();
    }

    // change location for pickup
    async changeLocation(userLocation, auth_id) {
        const db = new orm('mylibrary');
        await db.updateOne('users', { location: userLocation }, { auth_id });
        await db.close();
    }

    // remove location for pickup
    async removeLocation(userLocation, auth_id) {
        const db = new orm('mylibrary');
        await db.removeOne('users', { location: userLocation }, { auth_id });
        await db.close();
    }
}

module.exports = UserModel
