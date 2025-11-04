import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import GoogleStrategy from 'passport-google-oauth2';

const initializePassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }
            const isMatch = bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                console.log('Incorrect password attempt for user:', username);
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/api/auth/google/redirect",
        passReqToCallback: true
    },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ googleId: profile.id });
                
                if (existingUser) {
                    return done(null, existingUser);
                }
                
                // If not, create new user
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    username: profile.email,
                    password: '' // no password since using google oauth
                });
                
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        try {
            done(null, user.id);
        } catch (err) {
            done(err, null);
        }
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                return done(new Error('User not found'), null);
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    });

}

export default initializePassport;