const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL || "http://localhost:8000";


const detectObjects = async (filePath) => {

    const form = new FormData();

    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
        `${ML_SERVICE_URL}/detect-object`,
        form,
        {
            headers: form.getHeaders()
        }
    );

    return response.data;
};


const detectAIImage = async (filePath) => {

    const form = new FormData();

    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
        `${ML_SERVICE_URL}/detect-ai-image`,
        form,
        {
            headers: form.getHeaders()
        }
    );

    return response.data;
};


module.exports = {
    detectObjects,
    detectAIImage
};