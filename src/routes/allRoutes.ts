const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const UserFeedback = require('../models/userFeedbackSchema');
const userAccessPermission = require('../middleware/userAccessPermision'); 
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const {
  login,
  signupDefault,
  signup
} = require("../controllers/userController");

router.get("/",userAccessPermission,(req, res)=>{
    res.status(200).json({"message":"Welcome to home page."});
})


router.post("/login", login);
router.get("/signup", signupDefault);
router.post("/signup", signup);

//logout route
router.get("/logout",userAccessPermission, async (req, res, next) => {
    try {
        // Clear the cookie by setting its expiration date to the past
        res.cookie("userCookie", "", {
            expires: new Date(Date.now() - 1000), // Set to a past date
            httpOnly: true,
            sameSite: 'Lax', // or 'None' for cross-site
            secure: false,   // Set to true in production with HTTPS
        });

        // removing the token from the database
        const user = await User.findById(req.userInfo._id);
        if (!user) {
            return res.status(404).json({"message":"User not found."});
        }else{
            user.tokens = [];
        await user.save();
        }

        res.status(200).json({"message":"Logout successful."});


    } catch (error) {
        console.log("Error in logout get router.");
        next(error);
    }
});

router.get("/me", userAccessPermission, (req, res) => {
    res.status(200).json({userInfo: req.userInfo, message: "User information retrieved successfully."});
});


//user feedback route
router.get("/feedback",(req, res)=>{
    res.status(200).json({"message":"Welcome to feedback page."});
})

router.post("/feedback", async (req,res,next)=>{
    try {
        const {userId, userName, feedbackText, rating} = req.body;
        if(!userId || !userName || !feedbackText || !rating) {
            return res.status(400).json({"message":"All fields are required."});
        }else{
            const newFeedback = new UserFeedback({
                userId: new mongoose.Types.ObjectId(userId),
                userName: userName,
                feedbackText: feedbackText,
                rating: rating
            });
            await newFeedback.save()
            .catch((error) => {
                return res.status(500).json({"message":"Internal Server Error"});
            });
            res.status(201).json({"message":"Feedback submitted successfully."});
        }
    } catch (error) {
        console.log("Error in sending feedback post router.");
        next(error);
    }
})


//new section
//----------------Admin routers----------------------------------
// using this route i can create an admin, not using /signup route
// and to create admin i have to run this in postman 
// {
//   "username": "admin1",
//   "email": "admin@example.com",
//   "password": "yourStrongPassword123",
//   "secret": "your-secure-secret"
// }
// or i have to create a signup page only for admin which will hit in this route name
router.post("/register-admin", async (req, res) => {
  const { username, email, password, secret } = req.body;

  // Validate secret (hardcoded or use .env)
  if (secret !== process.env.ADMIN_CREATION_SECRET) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    username,
    email,
    password: hashedPassword,
    role: "admin"
  });

  await admin.save();
  res.status(201).json({ message: "Admin created" });
});

// load dashboard data
router.get("/loadAdminDashboardValues", async (req, res, next) => {
  try {
    const ratingCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const users = await User.find({ role: "user" });
    const userFeedbacks = await UserFeedback.find({});

    const userCount = users.length;
    const feedbackCount = userFeedbacks.length;

    userFeedbacks.forEach((data) => {
      if (ratingCount[data.rating] !== undefined) {
        ratingCount[data.rating] += 1;
      }
    });

    const totalRatings =
      ratingCount[5] * 5 +
      ratingCount[4] * 4 +
      ratingCount[3] * 3 +
      ratingCount[2] * 2 +
      ratingCount[1] * 1;

    const totalFeedbacks =
      ratingCount[5] +
      ratingCount[4] +
      ratingCount[3] +
      ratingCount[2] +
      ratingCount[1];

    const averageRating =
      totalFeedbacks === 0 ? 0 : (totalRatings / totalFeedbacks).toFixed(2);

    res.status(200).json({
      users,
      userFeedbacks,
      userCount,
      feedbackCount,
      ratingCount,
      averageRating,
    });
  } catch (error) {
    next(error);
  }
});


//delete user
router.post("/deleteUser", async(req,res,next)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        

        await User.deleteOne({_id:userId});
        const newUsers = await User.find({});


        
        res.status(200).json({newUsers: newUsers});
    } catch (error) {
        next(error);
    }
})
//delete user feedback
router.post("/deleteFeedback", async(req,res,next)=>{
    try {
        const userFeedbackId = new mongoose.Types.ObjectId(req.body.userFeedbackId);

        await UserFeedback.deleteOne({_id:userFeedbackId});
        const newFeedback = await UserFeedback.find({});


        res.status(200).json({newFeedback: newFeedback});
    } catch (error) {
        next(error);
    }
})

module.exports = router;