// user schema
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String, 
        required: true
    },
    username: { //email as username (defalut in passwordjs)
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        // required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
