const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Session setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Body parser for handling form data
app.use(express.urlencoded({ extended: false }));

// Define a simple user database (for demo purposes)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Passport Local Strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) return done(null, user);
        return done(null, false, { message: 'Incorrect username or password.' });
    }
));

// Serialize user information into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Paths
const publicPath = path.join(__dirname, 'public');
const srcPath = path.join(__dirname, 'src');
app.use(express.static(path.join(__dirname, 'src')));

// Serve static files
app.use(express.static(publicPath));

// Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(srcPath, 'login.html'));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

app.get('/signup', (req, res) => {
    res.sendFile(path.join(srcPath, 'signup.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(srcPath, 'dashboard.html'));
});

// Protected routes
app.get('/food', isAuthenticated, (req, res) => {
    res.sendFile(path.join(srcPath, 'food.html'));
});

app.get('/technology', isAuthenticated, (req, res) => {
    res.sendFile(path.join(srcPath, 'technology.html'));
});

app.get('/travel', isAuthenticated, (req, res) => {
    res.sendFile(path.join(srcPath, 'travel.html'));
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.sendFile(path.join(srcPath, 'contact.html'));
});

app.get('/index', isAuthenticated, (req, res) => {
    res.sendFile(path.join(srcPath, 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
