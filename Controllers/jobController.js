const companyModel = require("../models/company-model");


const jobModel = require("../models/job-model");
// admin post garxa
module.exports.postjob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, company } = req.body
        const userId = req.id;
     
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !company) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            })
        }
        let companydet = await companyModel.findById(company)
        if(!companydet) return res.status(404).json({
            message:"Company not found",
            success:false,
        })
        const job = await jobModel.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experience,
            position,
            company,
            createdBy: userId,
        }
        )
        companydet.jobs.push(job._id)
        await companydet.save();
        return res.status(200).json({
            message: "New job Created",
            job,
            companydet,
            success: true,
        })

    } catch (error) {
        res.json({
            message: error.message,
            success: false
        })
    }
}
// Search garera nikalne sab job dinxa
module.exports.getAllJobs = async (req, res) => {
    try {
        const keywords = req.query.keywords || "";
        const query = {
            $or: [
                { title: { $regex: keywords, $options: "i" } },
                { description: { $regex: keywords, $options: "i" } },
            ]
        }
        const job = await jobModel.find(query).populate("company").sort({createdAt: -1})
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found",
            })
        }
        return res.status(200).json({
            message: "job found",
            success: true,
            job,
        })
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
}
// Student job by id\
// params bata idd pass garera nikalne
// job detail page ma use garera nikalne
module.exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobModel.findById(jobId).populate("company")
        if(!job){
            return res.status(404).json({
                message:"Jobs not Found",
                success:false,
            })

        }
        return res.status(200).json({
            job,
            success:true,
        })

    } catch (error) {

        res.json({ message: error.message })
    }
}

// admin le kate ota job create garyo
module.exports.getAdminJob = async (req,res)=>{
    try {
        const adminId = req.id;
        const job = await jobModel.find({createdBy:adminId}).populate("company")
    
        if(!job) return res.status(400).json({
            message:"job not available",
            success:false,
        })
        res.status(200).json({
            message:"job found",
            job,
            success:true,
        })
        
    } catch (error) {
        res.json({ message: error.message })
    }
}