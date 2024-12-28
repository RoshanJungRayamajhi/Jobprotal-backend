const express = require("express");

const applicationModel = require("../models/application-model")
const jobModel = require("../models/job-model")




module.exports.applyjob = async (req, res) => {
    try {
        const userId = req.id; // Ensure this is being set in middleware
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false,
            });
        }

        // Check if the job exists and populate applications
        const job = await jobModel.findById(jobId).populate("company")
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        // Check if the user has already applied for this job
        const isAlreadyApplied = await applicationModel.findOne({
            job: jobId,
            applicant: userId,
        });

        if (isAlreadyApplied) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false,
            });
        }

        // Create a new application
        const newApplication = await applicationModel.create({
            job: jobId,
            applicant: userId,
        });

        // Add the application to the job's applications list
        job.applications.push(newApplication._id);
        job.applicants.push(userId)
        await job.save();

        return res.status(200).json({
            message: "Job applied successfully.",
            success: true,
            job: job,
        });
    } catch (error) {
        console.error("Error in applyjob:", error); // Logs full error stack
        return res.status(500).json({
            message: "An error occurred while applying for the job.",
            success: false,
        });
    }
};



// yo chai hami user haru le herna wala hoo 
// yo chai hamro profile page ma hunxaaa
module.exports.getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await applicationModel.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'company' }
        });
        if (!application) {
            return res.status(404).json({
                message: "No application found",
                success: false,
            })
        }
        res.json({
            message: "applied job",
            application,
        })

    } catch (error) {
        res.status(404).json({
            message: error.message,
            success: false,
        })
    }
}

// jun params bata jobid aako hunxa ni tyo kate jana le application deye vanera aauxa
// yo admin le matra herna sakxa
module.exports.getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await jobModel.findById(jobId)
       

        if (!job) {
            return res.status(404).json({
                message: "job not found",
                success: false,
            })
        }
        if(job.createdBy.toString() !== userId){
            return res.status(404).json({
                message: "you are not authorized to view this job applicants",
                success: false,
            })
        }


        const applicant = await applicationModel.find({job:jobId}).populate("applicant")
      
        
        // if(job?.applicants?.length < 1){
        //     return res.status(404).json({
        //         message: "no applicant found",
        //         success: false,
        //     })
        // }


       
       
        return res.status(200).json({
            message:"applicants found",
            applicant,
            success: true,
        })


    } catch (error) {
        res.status(404).json({
            message: error.message,
            success: false,
        })
    }
}

// yesma applicant id dina parxa tei ho kuro
module.exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id
        if (!status) {
            return res.status(400).json({
                message: "Status required",
                success: false,
            })
        }
        const application = await applicationModel.findOne({
            _id: applicationId,
        })
        if (!application) {
            return res.status(400).json({
                message: "Application not found",
                success: false
            })
        }
        // update status
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message: "Status Updated Successfully",
            success: true,
            application
        })

    } catch (error) {
        res.json({
            message: error.message,
        })
    }
}