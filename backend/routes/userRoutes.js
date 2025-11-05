import { Router } from "express";
import hasPassport from '../middleware/hasPassport.js';
import { Search } from '../models/Search.js';

const router = Router();

// Add search in database
router.post('/add-search', hasPassport,  async (req, res) => {
    const { term } = req.body;
    const userId = req.user._id;
    try {
        // Check if the search term already exists for the user
        let searchEntry = await Search.findOne({ userId, term });
        if (searchEntry) {
            // If it exists, increment the frequency and update the timestamp
            searchEntry.frequency += 1;
            searchEntry.timestamp = Date.now();
        }
        else {
            // If it doesn't exist, create a new search entry
            searchEntry = new Search({ userId, term });
        }
        await searchEntry.save();
        res.status(200).json({ success: true, message: 'Search term added/updated successfully' });
    } catch (error) {
        console.error('Error adding/updating search term:', error);
        res.status(500).json({ success: false, error: 'Failed to add/update search term' });
    }
});

// get top 5 most frequent search (no passport required)
router.get('/top-searches', async (req, res) => { 
    try {
        // Get top 5 most searched terms by frequency
        const topSearches = await Search.find()
            .sort({ frequency: -1 })
            .limit(5)
            .select('term frequency -_id');
        
        // Send the response
        res.status(200).json({
            success: true,
            data: topSearches
        });

    } catch (error) {
        console.error('Error fetching top searches:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch top searches' 
        });
    }
});

// get user's search history
router.get('/history', hasPassport, async (req, res) => {
    const userId = req.user._id;
    try {
        const searchHistory = await Search.find({ userId })
            .sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: searchHistory });
    } catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch search history' });
    }
});

export default router;