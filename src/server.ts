const express = require('express');
const app = express();
const allRouters = require('./routes/allRouters'); 
const userSchema = require('./models/userSchema');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const mongodbConnect = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');


dotenv.config()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set("trust proxy", 1);

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://1-minute-quiz.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// MongoDB connection
mongodbConnect();

// accessing router
app.use('/',allRouters)

// default error handler
const errorHandler = (err:any, req:any, res:any, next:any)=>{
    if(res.headersSent){
        return next(err);
    }
    res.json({
        status: "error",
        message: err.message || "Internal Server Error",
        error: err,
    });
}
app.use(errorHandler);

// start server 
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

   