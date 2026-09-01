const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const { sendPasswordResetOTP } = require("../services/emailService");

const registerUser = async ({ name, email, phone, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  return user;
};


// login function

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.isBanned) {
    throw new Error("User is banned");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    user,
    token,
  };
};

const forgotPassword = async (email) => {

  const user = await User.findOne({ email });

  

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
    Date.now() + 10 * 60 * 1000
  );

  user.resetPasswordOTP = hashedOTP;
  user.resetPasswordOTPExpires = otpExpiry;
  user.resetPasswordVerified = false;

  await user.save();

  // Send OTP

  await sendPasswordResetOTP(
    user.email,
    otp
  );
};


// VERIFY RESET OTP

const verifyResetOTP = async ({ email, otp }) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  if (!user.resetPasswordOTP) {
    throw new Error("Invalid or expired OTP");
  }

  if (
    !user.resetPasswordOTPExpires ||
    user.resetPasswordOTPExpires < new Date()
  ) {

    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    user.resetPasswordVerified = false;

    await user.save();

    throw new Error("OTP has expired");
  }

  const hashedOTP = crypto
    .createHash("sha256")
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