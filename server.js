const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const app = express();


const secret = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

const users = [
    { id: 1, email: 'user1@example.com', password: 'password1' },
    { id: 2, email: 'user2@example.com', password: 'password2' }
];

passport.use(new LocalStrategy(
    { usernameField: 'email' }, 
    (email, password, done) => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) return done(null, user);
        return done(null, false, { message: 'Incorrect email or password.' });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
});


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
