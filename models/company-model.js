const mongoose = require('mongoose')

const companySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    },
    creator:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true,
    },
    jobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Job"
        }
    ],
    logo:{
        type:String,  
    }
},{timestamps:true})


module.exports = mongoose.model("Company", companySchema)