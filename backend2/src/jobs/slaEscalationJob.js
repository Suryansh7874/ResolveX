const cron = require("node-cron");
const { escalateIssues } = require("../services/slaEscalationService");


// Run every 15 minutes
cron.schedule("* * * * *", async () => {

    console.log("Running SLA escalation...");

    await escalateIssues();

});