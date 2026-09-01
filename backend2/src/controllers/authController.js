const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} = require("../services/authService");

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



// login function


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({    
        success: false,
        message: "Email and password are required",
      });
    }

    const { user, token } = await loginUser({
      email,
      password,
    });

    res.status(200).json({   // 200 OK
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({   // Sends 401 Unauthorized when authentication fails.
      success: false,
      message: error.message,
    });
  }
};





const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const adminTest = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
};


// FORGOT PASSWORD

const forgotPasswordController = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Email is required",
      });

    }

    await forgotPassword(email);

    

    return res.status(200).json({

      success: true,

      message:
        "If an account exists with this email, a password reset OTP has been sent.",

    });

  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to process password reset request",

    });

  }
};


// VERIFY OTP

const verifyResetOTPController = async (req, res) => {

  try {

    const {
      email,
      otp
    } = req.body;

    if (!email || !otp) {

      return res.status(400).json({

        success: false,

        message:
          "Email and OTP are required",

      });

    }

    await verifyResetOTP({
      email,
      otp,
    });

    return res.status(200).json({

      success: true,

      message:
        "OTP verified successfully",

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }
};


// RESET PASSWORD

const resetPasswordController = async (req, res) => {

  try {

    const {
      email,
      newPassword
    } = req.body;

    if (!email || !newPassword) {

      return res.status(400).json({

        success: false,

        message:
          "Email and new password are required",

      });

    }

    await resetPassword({
      email,
      newPassword,
    });

    return res.status(200).json({

      success: true,

      message:
        "Password reset successfully",

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }
};


module.exports = {
  register,
  login,
  getMe,
  adminTest,
  forgotPasswordController,
  verifyResetOTPController,
  resetPasswordController,
};