const express = require("express");
const router = express.Router();
const secured = require("../lib/middleware/secured");


/* GET home page. */
router.get("/browse", secured(), function (req, res, next) {
    console.log("browse page loaded");
    res.render("browse", { title : "Browse Page" });
});

module.exports = router;
