const mongoose = require("mongoose"); //for creating schema
const bcrypt = require("bcryptjs");  //for encrypting password

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
      trim: true,  // Remove whitespace from both ends of the string
    },

    email: {
      type: String,
      required: true, // Email is required
      unique: true,  // Ensure email is unique
      lowercase: true, // Convert email to lowercase
      trim: true,  // Remove whitespace from both ends of the string
    },
     
  
    phone: {
      type: String,
      trim: true, 
    },

    password: {
      type: String,
      required: true, // Password is required
      minlength: 8,  // Minimum length of 8 characters
    },

    role: {
      type: String,
      enum: ["CITIZEN", "GOVERNMENT", "HEI_ADMIN", "FACULTY", "STUDENT", "INDUSTRY"],
      default: "CITIZEN",
    },

    heiId: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the HEI model
      ref: "HEI",
      default: null,
    },
    

    digiLockerId: {
      type: String,
      default: null,
    },

    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    invalidReportCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    resetPasswordOTP: {
      type: String,
      default: null,
    },

    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },

    resetPasswordVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



userSchema.pre("save", async function () {// Pre-save hook to hash the password before saving the user document
  if (!this.isModified("password")) { // If the password field is not modified, skip hashing
    return;
  }

  this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
});

module.exports = mongoose.model("User", userSchema);