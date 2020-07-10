require('dotenv').config();

const express = require('express');
const secured = require('../lib/middleware/secured');

const router = express.Router();

const Book = require('../models/book');

const BookModel = new Book();

const User = require('../models/user');

const UserModel = new User();

const Message = require('../models/message');

const MessageModel = new Message();

// updating value
router.put('/credits', secured(), async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const currentCredits = await UserModel.checkCredits(userProfile.user_id);
    await UserModel.addCredits(currentCredits + req.body.credChange, userProfile.user_id);
    res.status(200);
});

// check credits
router.get('/credits', secured(), async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const currentCredits = await UserModel.checkCredits(userProfile.user_id);
    res.status(200).send(JSON.stringify(currentCredits));
});

router.put('/user', secured(), async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    await UserModel.updateName(req.body.name, userProfile.user_id);
    await UserModel.addCredits('0', userProfile.user_id);
    res.status(200).send('It worked, woohoo');
});

// Check database using auth_id to determine if a location exists.
// If a location value does not exist, POST new location to database.
router.post('/location', secured(), async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const location = await UserModel.getLocation(userProfile.user_id);
    if (!location) {
        await UserModel.addLocation(req.body.userLocation);
        res.status(200);
    }
});

// Check database using auth_id to determine if a location exists.
// If a location value exists, PUT (replace) new location in database.
router.put('/location', secured(), async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    await UserModel.changeLocation(req.body.userLocation, userProfile.user_id);
    res.status(200).send('YAY!');
});

// Check database using auth_id to determine if a location exists.
// If a location value exists, DELETE old location from database.
router.delete('/location', secured(), async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const location = await UserModel.getLocation(userProfile.user_id);
    if (location) {
        await UserModel.removeLocation(req.body.userLocation, userProfile.user_id);
        res.status(200);
    }
});

module.exports = router;
