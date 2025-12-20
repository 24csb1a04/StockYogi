import express from 'express'
import { getDailyMarketNews } from '../controllers/newsController.js'
const router = express.Router();
router.get('/news' , getDailyMarketNews)
export default router;