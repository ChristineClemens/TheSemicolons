const express = require('express');
require('dotenv').config();
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    },
    ((accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    ),
);

const sess = {
    secret: 'IlCxQ438B1tFOGIvESOD9UlL1G2uckmXNytLSOEgKhQJgLQusHNSi_i7uHVJNQgb',
    cookie: {},
    resave: false,
    saveUninitialized: true,
};

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

if (app.get('env') === 'production') {
    // Use secure cookies in production (requires SSL/TLS)
    sess.cookie.secure = true;
}

app.use(session(sess));
passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// For authentication
const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');

// api calls

const usersApiRouter = require('./routes/user_api');
const bookApiRouter = require('./routes/book_api');
const messagesAPIRouter = require('./routes/messages_api')

// pages/routes
const indexRouter = require('./routes/index');
const mylibrary = require('./routes/mylibrary');
const browseRouter = require('./routes/browse')
const bookRequest = require('./routes/bookRequest')
const messages = require('./routes/messages')
const newBook = require('./routes/newBook')

app.use(userInViews());
app.use('/', authRouter);
app.set('trust proxy', 1)

app.use('/api', bookApiRouter, messagesAPIRouter, usersApiRouter);
app.use('/', indexRouter, mylibrary, browseRouter, bookRequest, messages, newBook);
app.use(express.static('public'));
app.use((req, res) => {
    res.render('404');
});
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
