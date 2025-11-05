// user schema
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    githubId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    name: {
        type: String, 
        required: true
    },
    username: { //email as username (defalut in passwordjs)
        type: String, 
        // required: true, // optional for oauth users except google
        unique: false // to avoid duplicate null entries
    },
    password: { 
        type: String, 
        // required: true // optional for oauth users
    },
    avatar: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
