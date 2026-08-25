const mongoose =require('mongoose');
//Connecting to the database
const connectDB=async()=>{
    try{
        await
        mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");

        console.log("Database:", mongoose.connection.name);

    } catch (error){
        console.error("MongoDB connection failed:",error.message);
        process.exit(1);
    }
};
module.exports=connectDB;