const Issue = require("../models/Issue");
const { calculatePriority } = require("../utils/priorityEngine");


const escalateIssues = async () => {

    try {

        const issues = await Issue.find({
            status: { $ne: "RESOLVED" }
        });

        let updatedCount = 0;

        for (const issue of issues) {

            const issueAgeInDays =
                (Date.now() - issue.createdAt.getTime()) /
                (1000 * 60 * 60 * 24);

            let deadlineRemainingInDays = Infinity;

            if (issue.deadline) {
                deadlineRemainingInDays =
                    (issue.deadline.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24);
            }

            const newPriority = calculatePriority({
                currentPriority: issue.priority,
                upvoteCount: issue.upvotedBy.length,
                issueAgeInDays,
                deadlineRemainingInDays,
            });

            if (newPriority !== issue.priority) {

                console.log(
                    `Priority escalated: ${issue._id} ${issue.priority} → ${newPriority}`
                );

                issue.priority = newPriority;

                await issue.save();

                updatedCount++;
            }
        }

        console.log(
            `SLA escalation completed. ${updatedCount} issues updated.`
        );

    } catch (error) {

        console.error(
            "SLA escalation failed:",
            error.message
        );

    }
};


module.exports = {
    escalateIssues,
};