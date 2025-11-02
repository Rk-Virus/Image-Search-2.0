// user router
import express from 'express';
import { User } from '../models/User.js';
import passport from 'passport';
import hasPassport from '../middleware/hasPassport.js';
import bcrypt from 'bcrypt';


const router = express.Router();

// Route to get all users

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

router.post('/login', passport.authenticate('local', { failureRedirect: '/api/login', successRedirect: '/api/profile' }));

router.get('/profile', hasPassport, (req, res) => { 
    res.json({ message: "welcome, you are authenticated" });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

export default router;