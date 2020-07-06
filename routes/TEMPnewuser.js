const express = require("express");
const router = express.Router();
const secured = require("../lib/middleware/secured");

/* GET home page. */
router.get("/newuser", secured(), async function (req, res, next) {
    console.log("new user page loaded");

    res.render("newuser", {
        title: "New User Page",
    });
});

module.exports = router;






