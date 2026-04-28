const jwt = require("jsonwebtoken");
const { User } = require("../models");
 
// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
   { expiresIn: process.env.JWT_EXPIRES_IN }// Token expires in one hour
  );
};
 
// Register new user
const register = async (userData) => {
  try {
    const { firstName, lastName, email, password, accountType } = userData;
 
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
 
    // Create new user (password will be hashed by beforeCreate hook)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      accountType: accountType || "savings",
    });
 
    // Generate token
    const token = generateToken(user.id);
 
    return {
      success: true,
      token,
      user: user.toJSON(), // This removes password automatically
    };
  } catch (error) {
    throw error;
  }
};
 
// Login user
const login = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
 
    if (!user) {
      throw new Error("Invalid email or password");
    }
 
    // Check if user is verified (optional - remove if not needed)
    // if (!user.isVerified) {
    //   throw new Error("Please verify your email before logging in");
    // }
 
    // Compare password
    const isPasswordValid = await user.comparePassword(password);
 
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
 
    // Generate token
    const token = generateToken(user.id);
 
    return {
      success: true,
      token,
      user: user.toJSON(),
    };
  } catch (error) {
    throw error;
  }
};
 
// Get user profile
const getProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
 
    if (!user) {
      throw new Error("User not found");
    }
 
    return {
      success: true,
      user,
    };
  } catch (error) {
    throw error;
  }
};
 
// Update user profile
const updateProfile = async (userId, updates) => {
  try {
    const user = await User.findByPk(userId);
 
    if (!user) {
      throw new Error("User not found");
    }
 
    // Don't allow updating certain fields
    const allowedUpdates = ["firstName", "lastName"];
    const filteredUpdates = {};
 
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });
 
    // Update user
    await user.update(filteredUpdates);
 
    return {
      success: true,
      user: user.toJSON(),
    };
  } catch (error) {
    throw error;
  }
};
 
// Change password
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
 
    if (!user) {
      throw new Error("User not found");
    }
 
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
 
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }
 
    // Update password (will be hashed by beforeUpdate hook)
    user.password = newPassword;
    await user.save();
 
    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    throw error;
  }
};
 
// Verify email (optional - for email verification flow)
const verifyEmail = async (userId) => {
  try {
    const user = await User.findByPk(userId);
 
    if (!user) {
      throw new Error("User not found");
    }
 
    user.isVerified = true;
    await user.save();
 
    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    throw error;
  }
};
 
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  generateToken,
};