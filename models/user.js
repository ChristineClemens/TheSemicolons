const orm = require("../config/orm");

class UserModel {
    async getUserByID(userID) {
        let db = new orm("mylibrary");
        let user = await db.selectSome("users", "auth_id", userID);
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
async function addLocation(userLocation) {
    let db = new orm ("mylibrary");
    await db.insertOne("users", {location: userLocation});
    await db.close();
}
// change location for pickup
async function changeLocation(userLocation) {
    let db = new orm ("mylibrary");
    await db.updateOne("users", {location: userLocation});
    await db.close();
}
//remove location for pickup
async function removeLocation(userLocation) {
    let db = new orm ("mylibrary");
    await db.removeOne("users", u{location: userLocation});
    await db.close();
}


module.exports = UserModel