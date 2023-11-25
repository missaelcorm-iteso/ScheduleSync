const fs = require('fs');
const pdf = require('pdf-parse');

const parsePDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        console.log(data.text);

        return data;
    } catch (error) {
        console.error('Error parsing PDF:', error.message);
        throw error;
    }
};

module.exports = parsePDF;