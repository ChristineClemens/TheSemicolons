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
const userInViews = require("./lib/middleware/userInViews");
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

//Actually initializing the routes we've created
app.use(userInViews());
app.use("/", authRouter);
app.use("/", indexRouter);
app.use("/", usersRouter);

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
