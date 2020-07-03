//This is for grabbing data from the actual user, we can render views and whatnot here specific to a user to show their lists et cetera
module.exports = function () {
    return function (req, res, next) {
        // console.log(req.user)
        res.locals.user = req.user;
        next();
    };
};
