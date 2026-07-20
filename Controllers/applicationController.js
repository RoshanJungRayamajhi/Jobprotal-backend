const express = require("express");

const applicationModel = require("../models/application-model")
const jobModel = require("../models/job-model")

const { getAtsScore } = require("../utils/atsScorer");
const { extractResumeText } = require("../utils/pdfText");

const { sendMail } = require("../utils/mailer");
const { acceptedEmail, rejectedEmail } = require("../utils/emailTemplates");





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
        if (job.createdBy.toString() !== userId) {
            return res.status(404).json({
                message: "you are not authorized to view this job applicants",
                success: false,
            })
        }

        const applicant = await applicationModel.find({ job: jobId }).populate("applicant")

        // compute ATS score for each applicant against this job
        const applicantsWithScore = await Promise.all(
            applicant.map(async (app) => {
                const resumeUrl = app.applicant?.profile?.resume; // adjust this path to match your userModel schema

                if (!resumeUrl) {
                    return {
                        ...app.toObject(),
                        ats: null,
                        atsError: "No resume uploaded"
                    };
                }

                try {
                    const resumeText = await extractResumeText(resumeUrl);
                    const atsResult = await getAtsScore(resumeText, job);
                    return {
                        ...app.toObject(),
                        ats: atsResult
                    };
                } catch (err) {
                    return {
                        ...app.toObject(),
                        ats: null,
                        atsError: err.message
                    };
                }
            })
        );

        return res.status(200).json({
            message: "applicants found",
            applicant: applicantsWithScore,
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
        }).populate("applicant").populate({
            path: "job",
            populate: { path: "company" }
        });

        if (!application) {
            return res.status(400).json({
                message: "Application not found",
                success: false
            })
        }

        // update status
        application.status = status.toLowerCase();
        await application.save();

        // send email based on new status
        const applicantEmail = application.applicant?.email;
        const applicantName = application.applicant?.fullname || application.applicant?.name || "Applicant";
        const jobTitle = application.job?.title || "the position";
        const companyName = application.job?.company?.name || "the company";

        if (applicantEmail) {
            if (application.status === "accepted") {
                await sendMail({
                    to: applicantEmail,
                    subject: `You've been accepted for ${jobTitle}!`,
                    html: acceptedEmail(applicantName, jobTitle, companyName),
                });
            } else if (application.status === "rejected") {
                await sendMail({
                    to: applicantEmail,
                    subject: `Update on your application for ${jobTitle}`,
                    html: rejectedEmail(applicantName, jobTitle, companyName),
                });
            }
        }

        return res.status(200).json({
            message: "Status Updated Successfully and email sent to applicant",
            success: true,
          
        })

    } catch (error) {
        res.json({
            message: error.message,
        })
    }
}