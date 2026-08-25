const mongoose=require('mongoose');
const issueSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        enum:[
                "pothole",
                "garbage",
                "streetlight",
                "traffic_signal",
                "damaged_road",
                "fallen_tree",
                "electrical_hazard",
                "other"
        ]
    },
    image:{
        type:String,
        required:true
    },
    location:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        }
    },
     priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
    },
    status:{
        type:String,
        default:"reported",
        enum:["reported","in_progress","resolved","rejected","citizen_verified"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false     
    },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null
    },

    officerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Officer",
        default: null
    },
     resolvedAt: {
        type: Date,
        default: null
    }

//implemented in officer controller when the officer resolves the issue{
// issue.status = "resolved";
// issue.resolvedAt = new Date();
// await issue.save();
// }

},
{
    timestamps:true
}  
);
module.exports=mongoose.model('Issue',issueSchema);
