const getSLAHours = (priority) => {
    const slaHours = {
        CRITICAL: 24,
        HIGH: 72,
        MEDIUM: 168,
        LOW: 336,
    };

    return slaHours[priority] || 168;
};


const calculateDeadline = (priority, createdAt = new Date()) => {
    const slaHours = getSLAHours(priority);

    const deadline = new Date(createdAt);

    deadline.setHours(
        deadline.getHours() + slaHours
    );

    return deadline;
};


module.exports = {
    getSLAHours,
    calculateDeadline,
};