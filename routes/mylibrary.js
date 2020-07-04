const express = require("express");
const secured = require("../lib/middleware/secured");
const router = express.Router();

/* GET user profile page for my library. */
router.get("/mylibrary", secured(), function (req, res, next) {
    console.log("MyLibrary Page opened")
    const { _raw, _json, ...userProfile } = req.user;
    let userName = userProfile.name.givenName || userProfile.displayName;
    res.render("mylibrary", {
        userProfile: JSON.stringify(userProfile, null, 2),
        userName: userName,
        title: "My Library",
    });
});

module.exports = router;
