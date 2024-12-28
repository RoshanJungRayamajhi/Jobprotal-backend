const mongoose = require('mongoose');

const ConnnectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/jobprotal`)
        console.log("connect to mongodb")
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = ConnnectDB