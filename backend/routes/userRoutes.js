import { Router } from "express";
import hasPassport from '../middleware/hasPassport.js';

const router = Router();

router.get('/profile', hasPassport, (req, res) => { 
    res.json({ message: "welcome, you are authenticated" });
});


export default router;