const express = require("express");
const router = express.Router(); //making route
const upload = require("../middleware/upload"); //to store the image received

const {
    createIssue,
    getDepartmentIssues,
    updateIssue,
    getMyIssues,
    getIssueById,
    updateMyIssue,
    deleteMyIssue
} = require("../controllers/issueController");

router.post("/",
   upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
    ]), 
    createIssue
);

router.get("/", getDepartmentIssues);     //filtering issues by department

router.patch("/:id", updateIssue);  //updating the issue status & priority by the officer

router.get("/my", getMyIssues);   //user seeing his own issues

router.get("/:id",getIssueById);  //Retrieving the issue by id

router.patch("/my/:id", updateMyIssue);  //user updating his own issue

router.delete("/my/:id", deleteMyIssue); //user deleting his issue

module.exports = router;
