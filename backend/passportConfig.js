import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import {User} from './models/User.js';

const initializePassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
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

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

}

export default initializePassport;