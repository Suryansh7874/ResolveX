const calculatePriority = ({
    currentPriority,
    upvoteCount = 0,
    issueAgeInDays = 0,
    deadlineRemainingInDays = Infinity,
}) => {
    
     if (deadlineRemainingInDays <= 0) {
        return "CRITICAL";
    }
    // 1. Base priority score
    const priorityScores = {
        LOW: 10,
        MEDIUM: 30,
        HIGH: 60,
        CRITICAL: 100,
    };

    let score = priorityScores[currentPriority] || 30;


    // 2. Community impact
    if (upvoteCount >= 25) {
        score += 20;
    } else if (upvoteCount >= 10) {
        score += 15;
    } else if (upvoteCount >= 5) {
        score += 10;
    } else if (upvoteCount >= 1) {
        score += 5;
    }


    // 3. Issue age
    if (issueAgeInDays >= 7) {
        score += 10;
    } else if (issueAgeInDays >= 3) {
        score += 7;
    } else if (issueAgeInDays >= 1) {
        score += 4;
    }


    // 4. Deadline urgency
    if (deadlineRemainingInDays <= 0) {
        // SLA has already expired
        score += 25;
    } else if (deadlineRemainingInDays <= 1) {
        // Less than 24 hours remaining
        score += 20;
    } else if (deadlineRemainingInDays <= 3) {
        // Less than 3 days remaining
        score += 10;
    } else if (deadlineRemainingInDays <= 7) {
        // Less than 7 days remaining
        score += 5;
    }


    // 5. Convert score to final priority
    let priority;

    if (score >= 90) {
        priority = "CRITICAL";
    } else if (score >= 60) {
        priority = "HIGH";
    } else if (score >= 30) {
        priority = "MEDIUM";
    } else {
        priority = "LOW";
    }


    return priority;
};


module.exports = {
    calculatePriority,
};