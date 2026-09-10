const Issue = require("../models/Issue");
const User = require("../models/User");

const findOfficer = async (userId) => {
  const officerExist = await User.findById(userId)
    .select("name email phone role departmentId")  // to remove password fetching 
    .populate("departmentId");

    // using populate mongoose will replace department id with department name

  if (!officerExist) {
    throw new Error("Officer not exist");
  }

  if (officerExist.role !== "OFFICER") {
    throw new Error("You are not an Officer");
  }

const issues = await Issue.find({
  assignedTo: officerExist._id,
})
  .populate("reportedBy", "name email phone")
  .populate("departmentId", "name")
  .populate("assignedTo", "name email phone"); //Using populate(), Mongoose replaces the departmentId reference with the corresponding Department document.


    const assigned = issues.filter(issue => issue.status === "ASSIGNED").length;

    const inProgress = issues.filter(issue=>issue.status=== "IN_PROGRESS").length;

    const resolved = issues.filter(issue=>issue.status==="RESOLVED").length;

    const critical = issues.filter(issue=>issue.priority==="CRITICAL").length;

    const high = issues.filter(issue=>issue.priority==="HIGH").length;

    const low = issues.filter(issue=>issue.priority==="LOW").length;
    const medium = issues.filter(issue=>issue.priority==="MEDIUM").length;


  return{
    officer:officerExist,
    issues:issues,
    low:low,
    medium:medium,
    high:high,
    critical:critical,
    resolved:resolved,
    inProgress:inProgress,
    assigned:assigned,
  };
};


const getOfficerIssue = async (issueId,officerId) => {
    const issue = await Issue.findOne({
        _id: issueId,
        assignedTo: officerId,
    })
    .populate("reportedBy", "name email phone")
    .populate("departmentId", "departmentName code description")
    .populate("assignedTo", "name email phone");

    

    if(!issue){
        throw new Error("Issue not found with this issueId and officerId");
    }

    return issue;


}


module.exports = {
    findOfficer,
    getOfficerIssue,
};