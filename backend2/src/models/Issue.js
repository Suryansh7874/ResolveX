const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        reportedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",  // reference
            required:true,
        },

        title:{
            type:String,
            required:true,
            trim:true,
        },

        description:{
            type:String,
            required:true,
            trim:true,
        },

        category:{
            type: String,
            enum:[
                "POTHOLE",
                "ROAD_DAMAGE",
                "GARBAGE",
                "WATER_LEAKAGE",
                "DRAINAGE",
                "STREETLIGHT",
                "SEWER",
                "OTHER",
            ],
            required:true,
            trim:true,
        },

        departmentId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Department",
            required:true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

         media: [
    {
        type: {
            type: String,
            enum: ["image", "video"],
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
],


        status:{
            type:String,
            uppercase:true,
            enum: [
                "REPORTED",
                "VERIFIED",
                "ASSIGNED",
                "IN_PROGRESS",
                "RESOLVED",
            ],
            default:"REPORTED",
        },


        priority:{
            type:String,
            uppercase:true,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL",
            ],
            default:"MEDIUM",


        },

        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null,
        },


        upvotedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        



    },

    {
        timestamps:true,
    }
);

issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);