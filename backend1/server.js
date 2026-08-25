//Defining the server and connecting to the database
const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB =require("./src/config/db");
const issueRoutes = require("./src/routes/issueRoutes");
// const uploadRoutes = require("./src/routes/uploadroutes");
const mongoose = require("mongoose");
// const Issue = require("./src/models/Issue");

dotenv.config();  //.env file congiguration
connectDB(); //connecting to database

console.log("Database:", mongoose.connection.name);  //printing the name of the database connected to MongoDB

const app=express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/issues", issueRoutes);
// app.use("/api", uploadRoutes);

app.get('/',(req,res)=>{
    res.json({message:'Civic Issue Tracker Backend is running'});  //Printing on browser when the server is running
});


//Defining the port and starting the server
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
});