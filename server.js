const express = require("express");
require("dotenv").config();
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
let Auth0Strategy = require("passport-auth0");

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback",
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

const sess = {
    secret: "CHANGE THIS TO A RANDOM SECRET",
    cookie: {},
    resave: false,
    saveUninitialized: true,
};

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

if (app.get("env") === "production") {
    // Use secure cookies in production (requires SSL/TLS)
    sess.cookie.secure = true;
}

app.use(session(sess));
passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//For authentication
const userInViews = require("./lib/middleware/userInViews");
const authRouter = require("./routes/auth");

//api calls

const usersApiRouter = require("./routes/user_api");
const bookApiRouter = require("./routes/book_api");
const messagesAPIRouter = require("./routes/messages_api")

//pages/routes
const indexRouter = require("./routes/index");
const mylibrary = require("./routes/mylibrary");
const browseRouter = require("./routes/browse")
const bookRequest = require("./routes/bookRequest")
const messages = require("./routes/messages")
const newBook = require("./routes/newBook")
//TEMP
const TEMPuserpage = require("./routes/TEMPnewuser")
//initializing the routes we've created
app.use(userInViews());
app.use("/", authRouter);

app.use("/api", bookApiRouter, messagesAPIRouter, usersApiRouter);
app.use("/", indexRouter, mylibrary, browseRouter, bookRequest, messages, TEMPuserpage, newBook);
app.use(express.static('public'));
app.use(function(req, res) {
    res.render("404");
  });
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


//STEPS TO ADDING A PAGE
//create a handlebar file in views
//Create a router, define in routes/ and render the handlebar file
//import the router into server.js