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

const CLIENT_URL = process.env.CLIENT_URL;
// Local Authentication
router.post('/login', passport.authenticate('local', { failureRedirect: '/login/failed' }), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Login successful',
        // user: req.user,
    });
}); // local login

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); 
router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/login/failed', successRedirect: CLIENT_URL}));

// GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['profile'] })); 
router.get('/github/redirect', passport.authenticate('github', {failureRedirect: '/login/failed', successRedirect: CLIENT_URL}));

// Facebook OAuth login
router.get('/facebook', passport.authenticate('facebook')); 
router.get('/facebook/redirect', passport.authenticate('facebook', {failureRedirect: '/login/failed', successRedirect: CLIENT_URL}));


// Common routes for all authentication strategies
router.get('/login/failed', (req, res) => {
    console.log('Login failed for user');
    res.status(401).json({
        success: false,
        message: 'Login failed'
    })
});

// success api to check if user is logged in
router.get('/login/success', (req, res) => {
    console.log('Login success route accessed, user:', req.user);
    if (req.user) {
        res.status(200).json({
        success: true,
        message: 'Login successful',
        user: req.user,
        // cookies: req.cookies
    })
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        console.log('User logged out successfully');
        res.status(200).json({msg: 'success'});
    });
});

export default router;