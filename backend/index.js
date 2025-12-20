import express from 'express'
import cors from 'cors'
import connectdb from './config/db.js'
import errorHandler from "./middleware/errorMiddleware.js"
import authRoutes from "./routes/authRoutes.js"
import  stockRoutes from "./routes/stockRoutes.js"
import  aiRoutes from "./routes/aiRoutes.js"
import  newsRoutes from "./routes/newsRoutes.js"
import  portfolioRoutes from "./routes/portfolioRoutes.js"
import cookieParser from 'cookie-parser'

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/api/auth' , authRoutes)
app.use('/api/portfolio' , portfolioRoutes)
app.use('/api/stocks' , stockRoutes)
app.use('/api/ai' , aiRoutes)
app.use('/api/news' , newsRoutes)
app.use(errorHandler)
app.get('/' , (req , res)=>{
    return res.status(200).json({message : "Welcome to api!!"});
})
const PORT = 5000;
app.listen(PORT , ()=>{
    console.log(`app running on PORT ${PORT}`);
})