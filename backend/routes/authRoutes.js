// user router
import express from 'express';
import { User } from '../models/User.js';
import passport from 'passport';
import bcrypt from 'bcrypt';

const router = express.Router();

// Registering user
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    // Basic validation
    if (!name || !username || !password) {
        return res.status(400).json({ error: 'Please enter all fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({ name, username, password: hash });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});


// Authentication routes
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/api/user/profile' })); // local login

router.get('/google', passport.authenticate('google', { scope: ['profile'] })); // Google OAuth login
router.get('/google/redirect', passport.authenticate('google'), {failureRedirect: '/login'}, (req, res) => {
    res.status(200).json({msg: "success", user: req.user, cookies: req.cookies});
});

router.get('/test', (req, res) => {
    res.send("auth route working");
})  

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL);
    });
});

export default router;