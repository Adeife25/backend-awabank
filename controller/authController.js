const authService = require("../services/authService");
 
// Register new user

const register = async (req, res) => {

  try {

    const { firstName, lastName, email, password, accountType } = req.body;
 
    // Validate required fields

    if (!firstName || !lastName || !email || !password) {

      return res.status(400).json({

        success: false,

        message: "Please provide all required fields",

      });

    }
 
    // Validate password strength

    if (password.length < 6) {

      return res.status(400).json({

        success: false,

        message: "Password must be at least 6 characters long",

      });

    }
 
    // Call service

    const result = await authService.register({

      firstName,

      lastName,

      email,

      password,

      accountType,

    });
 
    res.status(201).json(result);

  } catch (error) {

    console.error("Register error:", error);
 
    // Handle specific errors

    if (error.message.includes("already exists")) {

      return res.status(409).json({

        success: false,

        message: error.message,

      });

    }
 
    if (error.name === "SequelizeValidationError") {

      return res.status(400).json({

        success: false,

        message: error.errors[0].message,

      });

    }
 
    res.status(500).json({

      success: false,

      message: "Registration failed. Please try again.",

    });

  }

};
 
// Login user

const login = async (req, res) => {

  try {

    const { email, password } = req.body;
 
    // Validate required fields

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message: "Please provide email and password",

      });

    }
 
    // Call service

    const result = await authService.login(email, password);
 
    res.status(200).json(result);

  } catch (error) {

    console.error("Login error:", error);
 
    if (

      error.message.includes("Invalid") ||

      error.message.includes("verify")

    ) {

      return res.status(401).json({

        success: false,

        message: error.message,

      });

    }
 
    res.status(500).json({

      success: false,

      message: "Login failed. Please try again.",

    });

  }

};
 
// Get user profile

const getProfile = async (req, res) => {

  try {

    const userId = req.user.id; // From auth middleware
 
    const result = await authService.getProfile(userId);
 
    res.status(200).json(result);

  } catch (error) {

    console.error("Get profile error:", error);
 
    if (error.message.includes("not found")) {

      return res.status(404).json({

        success: false,

        message: error.message,

      });

    }
 
    res.status(500).json({

      success: false,

      message: "Failed to get profile",

    });

  }

};
 
// Update user profile

const updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const updates = req.body;
 
    // Prevent updating sensitive fields

    if (updates.email || updates.password || updates.accountNumber) {

      return res.status(400).json({

        success: false,

        message:

          "Cannot update email, password, or account number through this endpoint",

      });

    }
 
    const result = await authService.updateProfile(userId, updates);
 
    res.status(200).json(result);

  } catch (error) {

    console.error("Update profile error:", error);
 
    res.status(500).json({

      success: false,

      message: "Failed to update profile",

    });

  }

};
 
// Change password

const changePassword = async (req, res) => {

  try {

    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;
 
    // Validate required fields

    if (!currentPassword || !newPassword) {

      return res.status(400).json({

        success: false,

        message: "Please provide current and new password",

      });

    }
 
    // Validate new password strength

    if (newPassword.length < 6) {

      return res.status(400).json({

        success: false,

        message: "New password must be at least 6 characters long",

      });

    }
 
    const result = await authService.changePassword(

      userId,

      currentPassword,

      newPassword

    );
 
    res.status(200).json(result);

  } catch (error) {

    console.error("Change password error:", error);
 
    if (error.message.includes("incorrect")) {

      return res.status(401).json({

        success: false,

        message: error.message,

      });

    }
 
    res.status(500).json({

      success: false,

      message: "Failed to change password",

    });

  }

};
 
// Logout (client-side only - remove token)

const logout = async (req, res) => {

  res.status(200).json({

    success: true,

    message: "Logged out successfully. Please remove token from client.",

  });

};
 
module.exports = {

  register,

  login,

  getProfile,

  updateProfile,

  changePassword,

  logout,

};
 