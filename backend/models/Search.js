// search schema
import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    term: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    frequency: {
        type: Number,
        default: 1
    },
});

export const Search = mongoose.model('Search', searchSchema);
