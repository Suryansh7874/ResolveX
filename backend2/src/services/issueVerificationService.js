const objectToCategory = {
    pothole: "POTHOLE",
    road_damage: "ROAD_DAMAGE",
    garbage: "GARBAGE",
    water_leakage: "WATER_LEAKAGE",
    drainage: "DRAINAGE",
    streetlight: "STREETLIGHT",
    sewer: "SEWER"
};


const verifyCategory = (geminiCategory, detections) => {

    const matchingDetection = detections.find(
        detection => {
            const category =
                objectToCategory[detection.object];

            return (
                category === geminiCategory &&
                detection.confidence >= 0.75
            );
        }
    );

    if (!matchingDetection) {
        return {
            verified: false,
            reason: "NO_MATCHING_OBJECT"
        };
    }

    return {
        verified: true,
        object: matchingDetection.object,
        confidence: matchingDetection.confidence
    };
};


module.exports = {
    verifyCategory
};