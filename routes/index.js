const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    console.log(req.user);
    res.render("index", { title: "Welcome to PageExchange" });
});

module.exports = router;
