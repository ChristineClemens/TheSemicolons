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



   //add credit
    async function addCredits(userCredits){
        let db = new orm ("mylibrary")
        await db.insertOne ("users", {credits: userCredits})
        await db.close()

    }

    //remove credit
    async function removeCredits(userCredits){
        let db = new orm ("mylibrary")
        await db.updateOne ("users", {credits: userCredits})
        await db.close()

    }

    //get credits
    async function checkCredits(userCredits){
        let db = new orm ("mylibrary")
        await db.selectSome ("users", {credits: userCredits})
        await db.close()
    }


    //retrieve location for pickup from database
    async getLocation(auth_id) {
        let db = new orm ("mylibrary");
        let users = await db.selectSome("users", "auth_id", auth_id);
        console.log(auth_id);
        await db.close();
        return users[0].location;
    }

    //add location for pickup
    async addLocation(userLocation) {
        let db = new orm ("mylibrary");
        await db.insertOne("users", {location: userLocation});
        await db.close();
    }
    // change location for pickup
    async changeLocation(userLocation) {
        let db = new orm ("mylibrary");
        await db.updateOne("users", {location: userLocation});
        await db.close();
    }
    //remove location for pickup
    async removeLocation(userLocation) {
        let db = new orm ("mylibrary");
        await db.removeOne("users", {location: userLocation});
        await db.close();
    }
};

module.exports = UserModel