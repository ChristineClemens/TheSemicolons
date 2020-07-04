const orm = require("../config/orm");

class UserModel {
    async getUserByID(userID) {
        let db = new orm("mylibrary");
        let user = await db.selectSome("users", { id: userID });
        await db.close();
        return user;
    }

    async addUser(user) {
        //user is an object
        let db = new orm("mylibrary");
        await db.insertOne("users", user);
        await db.close();
    }
}


//add credit

//remove credit

//get credits

//add location for pickup

// change location for pickup

//remove location for pickup