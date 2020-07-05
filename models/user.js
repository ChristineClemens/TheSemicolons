const orm = require("../config/orm");

class UserModel {
    async getUserByID(userID) {
        let db = new orm("mylibrary");
        let user = await db.selectSome("users", "auth_id", userID);
        await db.close();
        return user;
    }

    async getUsernameByDBID(db_id){
        let db = new orm("mylibrary");
        let user = await db.selectSome("users", "id", db_id);
        await db.close();
        //RIGHT NOW THERE IS NO NAME
        //TODO ADD NAME TO DB FROM USER SETTINGS PAGE?
        // return user[0].name;
        return "Ted"
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

module.exports = UserModel