const { getOfficerIssue } = require("../services/officerService");

const getOfficerIssueDetails = async (req, res) => {
  try {
    const issueId = req.params.issueId;
    const officerId = req.user.userId;

    const issue = await getOfficerIssue(issueId, officerId);

    return res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOfficerIssueDetails,
};