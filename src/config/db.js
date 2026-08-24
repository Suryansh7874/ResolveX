const mongoose = require("mongoose");

// async is used because connecting to a database takes some time.

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);  // The 1 indicates that the process ended because of an error.
  }
};

module.exports = connectDB;