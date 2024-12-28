const datauri = require("datauri/parser")
const path = require("path")

const getDataUri = (file) => {
    const parser = new datauri();
    const extname = path.extname(file.originalname).toString();
    return parser.format(extname,file.buffer);
}

module.exports = getDataUri;
