//This is what confirms the user is allowed to access this particular route.  If the user is allowed, next() gets called and the next 
//express function is called.  If not, then they are redirected to the login page.  We should add this as a middleware anywhere that 
//want to verify, which I think would be anywhere after the homepage and login page.
module.exports = function () {
    return function secured(req, res, next) {
        if (req.user) {
            return next();
        }
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    };
};
