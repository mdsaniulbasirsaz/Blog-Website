const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saniulsaz:12345@roktodin.abnxvco.mongodb.net/BlogWebsite2025', {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const secret = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password: String
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            console.log('Password hashed:', this.password); // Debugging line
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;


// POST route for user registration
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
app.get('/user/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userData } = user.toObject();

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// POST route for user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


// Paths
const srcPath = path.join(__dirname, 'src');
app.use(express.static(srcPath));

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
