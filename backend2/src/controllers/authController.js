const {
  registerUser,
  loginUser,
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

module.exports = {
  register,
  login,
  getMe,
  adminTest,
};