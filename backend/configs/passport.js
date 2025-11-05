import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import GoogleStrategy from 'passport-google-oauth2';
import GitHubStrategy from 'passport-github2';
import FacebookStrategy from "passport-facebook";

const initializePassport = (passport) => {
    // local login strategy
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Login attempt for user:', username, 'Match status:', isMatch);
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

    // Google OAuth strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/redirect",
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
                    password: '', // no password since using google oauth
                    avatar: profile.photos[0].value,
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    ));


    // GitHub OAuth strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/redirect",
        passReqToCallback: true
    },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ githubId: profile.id });

                if (existingUser) {
                    return done(null, existingUser);
                }
                // If not, create new user
                const newUser = new User({
                    githubId: profile.id,
                    name: profile._json.name,
                    username: profile.email, // may be null for github
                    password: '', // no password since using google oauth
                    avatar: profile._json.avatar_url,
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    ));


    // Facebook OAuth strategy
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true
    },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                console.log('Facebook profile:', profile);
                // Check if user already exists
                const existingUser = await User.findOne({ facebookId: profile.id });
                // console.log(profile._json.avatar_url)

                // console.log(existingUser)
                if (existingUser) {
                    return done(null, existingUser);
                }
                // If not, create new user
                const newUser = new User({
                    facebookId: profile.id,
                    name: profile.displayName,
                    username: profile.email, // might be null for facebook
                    password: '', // no password since using google oauth
                    avatar: profile.photos[0].value,
                });
                console.log("new user", newUser)
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    ));


    // Serialization and deserialization for sessions
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