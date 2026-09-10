const multer =require('multer');
const path=require('path');

const storage=multer.diskStorage({
    
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const uniqueName=Date.now()+"-"+Math.round(Math.random()*1E9);
        cb(
            null,
            uniqueName+path.extname(file.originalname)
        );
    }
});

const upload=multer({
    storage:storage ,
    limits:{
        fileSize:50*1024*1024
    },   
    fileFilter:(req,file,cb)=>{
        const allowedTypes=[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "video/mp4",
            "video/webm"
        ];
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else {
            cb(new Error("Only image and video files are allowed, Please try Again!!"));
        }
    }
});

module.exports=upload;