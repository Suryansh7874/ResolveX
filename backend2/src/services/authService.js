const bcrypt = require("bcryptjs");  //for encrypting password
const jwt = require("jsonwebtoken"); //for generating token

const User = require("../models/User"); //for user model

const crypto = require("crypto");  //for generating random OTP
const { sendPasswordResetOTP } = require("../services/emailService"); //for sending email

// Register function
const registerUser = async ({ name, email, phone, password }) => {
  const existingUser = await User.findOne({ email });// Check if a user with the given email already exists

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({ // Create a new user with the provided details
    name,
    email,
    phone,
    password,
  });

  return user;
};

// login function

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });// Find the user by email

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.isBanned) {
    throw new Error("User is banned");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);  // Compare the provided password with the hashed password stored in the database

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");  
  }

  const token = jwt.sign( // Generate a JWT token for the authenticated user
    {
      userId: user._id,// Include the user's ID in the token payload
      role: user.role,// Include the user's role in the token payload
    },
    process.env.JWT_SECRET, // Use the secret key from environment variables to sign the token
    {
      expiresIn: "7d", // Set the token to expire in 7 days
    }
  );

  return {
    user,
    token,
  };
};

// forgot password function
const forgotPassword = async (email) => {

  const user = await User.findOne({ email });  // Find the user by email

  if (!user) {
    return;
  }

  // Generate 6 digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP before storing
  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // OTP valid for 10 minutes
  const otpExpiry = new Date(
    Date.now() + 10 * 60 * 1000 // 10 minutes in milliseconds
  );

  user.resetPasswordOTP = hashedOTP;  // Store the hashed OTP in the user's document
  user.resetPasswordOTPExpires = otpExpiry;  // Store the OTP expiry time in the user's document
  user.resetPasswordVerified = false; // Reset the OTP verification status

  await user.save();

  // Send OTP via email
  await sendPasswordResetOTP(
    user.email,
    otp
  );
};


// VERIFY RESET OTP
const verifyResetOTP = async ({ email, otp }) => { 

  const user = await User.findOne({ email }); // Find the user by email

  if (!user) {
    throw new Error("Invalid or expired OTP"); // If the user is not found, throw an error 
  }

  if (!user.resetPasswordOTP) {
    throw new Error("Invalid or expired OTP"); // Check if the OTP exists in the user's document
  }

  if (
    !user.resetPasswordOTPExpires ||
    user.resetPasswordOTPExpires < new Date() // Check if the OTP has expired
  ) {

    user.resetPasswordOTP = null; // Clear the OTP and expiry fields in the user's document
    user.resetPasswordOTPExpires = null; 
    user.resetPasswordVerified = false;

    await user.save();

    throw new Error("OTP has expired");
  }

  const hashedOTP = crypto
    .createHash("sha256") // Hash the provided OTP to compare with the stored hashed OTP
    .update(otp) 
    .digest("hex"); 

  if (hashedOTP !== user.resetPasswordOTP) {
    throw new Error("Invalid OTP");
  }

  user.resetPasswordVerified = true;

  await user.save();

  return true;
};


// RESET PASSWORD

const resetPassword = async ({
  email,
  newPassword,
}) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid password reset request"); 
  }

  if (!user.resetPasswordVerified) {
    throw new Error("OTP verification required");
  }

  if (
    !user.resetPasswordOTPExpires ||
    user.resetPasswordOTPExpires < new Date()
  ) {

    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    user.resetPasswordVerified = false;

    await user.save();

    throw new Error("Password reset session has expired");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error(
      "Password must be at least 8 characters long"
    );
  }

  // Assigning the password and using save()
  // will trigger the User schema's bcrypt hook.

  user.password = newPassword;

  // Clear password reset data

  user.resetPasswordOTP = null;
  user.resetPasswordOTPExpires = null;
  user.resetPasswordVerified = false;

  await user.save();

  return true;
};


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};