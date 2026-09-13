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
                "EDUCATION",
                "HEALTHCARE",
                "AGRICULTURE",
                "WATER_RESOURCES",
                "SANITATION",
                "ENVIRONMENT",  
                "ENERGY",
                "RURAL_LIVELIHOODS",
                "URBAN_DEVELOPMENT",
                "ACCESSIBILITY",
                "PUBLIC_ADMINISTRATION",
                "DIGITAL_SERVICES",
                "TRANSPORTATION",
                "DISASTER_MANAGEMENT",
                "OTHER",
            ],
            required:true,
            trim:true,
        },

        // departmentId:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:"Department",
        //     required:true,
        // },

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
                "SUBMITTED",
                "AI_ANALYZED",
                "UNDER_REVIEW",
                "VALIDATED",
                "MATCHED",
                "HEI_ASSIGNED",
                "PROJECT_CREATED",
                "IN_PROGRESS",
                "PILOT",
                "DEPLOYED",
                "COMPLETED",
            ],
            default:"SUBMITTED",
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

        // assignedTo:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:"User",
        //     default:null,
        // },


        upvotedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],

        // verification: {
        //     aiGenerated: {
        //         type: String,
        //         enum: [
        //             "LIKELY_AI",
        //             "LIKELY_AUTHENTIC",
        //             "UNCERTAIN"
        //         ],
        //         default: "UNCERTAIN"
        //     },

        //     aiConfidence: {
        //         type: Number,
        //         min: 0,
        //         max: 1
        //     },

        //     detectedObject: {
        //         type: String
        //     },

        //     objectConfidence: {
        //         type: Number,
        //         min: 0,
        //         max: 1
        //     },

        //     imageCategory: {
        //         type: String
        //     },

        //     categoryMatch: {
        //         type: Boolean
        //     },

        //     verificationStatus: {
        //         type: String,
        //         enum: [
        //             "VERIFIED",
        //             "REVIEW_REQUIRED",
        //             "UNCERTAIN"
        //         ],
        //         default: "UNCERTAIN"
        //     }
        // }

        // deadline: {
        //     type: Date,
        //     default: null,
        // },

    },


    {
        timestamps:true,
    }
);

issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);