const mongoose  = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        departmentName:{
            type:String,
            required: true,
            unique: true,
            trim: true,
        },

        code:{
            type:String,
            required:true,
            unique:true,
            uppercase:true,
            trim:true,
        },

        description:{
            type:String,
            default:"",
            trim:true,
        },

        isActive:{
            type:Boolean,
            default:true,
        },


    },
    {
            timestamps:true
    }
);



module.exports = mongoose.model("Department", departmentSchema);