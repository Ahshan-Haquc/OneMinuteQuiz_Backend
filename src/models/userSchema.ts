const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["user","admin"],
        default: "user"
    },
    tokens:[{                            
        token:{
            type: String
        }
    }],
    registrationDate:{
        type: Date,
        default: Date.now,
    }
});

// Method to generate JWT token
userSchema.methods.generateToken = function () {
  try {
    const userToken = jwt.sign(
      {
        _id: this._id.toString(),
        role: this.role,
        email: this.email
      },
      process.env.JWT_SECRET || 'ahsanSecretKey4356',
      {
        expiresIn: process.env.JWT_EXPIRATION || '1h'
      }
    );

    return userToken;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};



// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;