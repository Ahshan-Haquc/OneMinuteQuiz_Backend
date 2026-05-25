const User = require('../models/userSchema');
const UserFeedback = require('../models/userFeedbackSchema');
const userAccessPermission = require('../middleware/userAccessPermision'); 
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT
    const token = await user.generateToken();

    // 4. Set cookie
    res.cookie("userCookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

const signupDefault = (req,res)=>{
    res.status(200).json({"message":"Welcome to register page."});
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports={
    login,
    signupDefault,
    signup
}


