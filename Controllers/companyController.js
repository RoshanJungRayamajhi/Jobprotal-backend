const companyModel = require("../models/company-model");
const userModel = require("../models/user-model");
const getDataUri = require("../config/datauriConfig")
const cloudinary = require("../config/cloudinaryConfig")


module.exports.registerCompany = async (req, res) => {
    try {
        let { name } = req.body;
        if (!name) return res.status(404).json({
            message: "Company name is required",
            success: false,
        })
        let company = await companyModel.findOne({ name })
        if (company) {
            return res.status(400).json({
                message: "Company already exists",
                success: false,
            })
        }
        company = await companyModel.create({
            name,
            creator: req.id,
        })
        return res.status(201).json({
            message: "company registered ",
            company,
            success: true,
        })

    } catch (error) {
        res.json({
            message: error.message,
            success: false,
        })
    }
}
// get all admin      company
module.exports.getCompany = async (req, res) => {
    try {
        let userId = req.id;
        const company = await companyModel.find({ creator: userId })
        console.log(company)
        if (!company) return res.status(404).json({
            message:"company not found",
            success: false,
        })
        res.status(201).json({
            message: "company found",
            success: true,
            company
        })

    } catch (error) {
        res.json({
            message: "error getting company",
            success: false,
        })
    }
}

module.exports.getCompanybyId = async (req, res) => {
    try {
        const companyId = req.params.id
        const company = await companyModel.findById(companyId)
        if (!company) return res.status(404).json({
            message:"company not found",
            success: false,
        })
        return res.status(200).json({
            message:
                "company found",
            company,
            success: true,
        })

    } catch (error) {
        res.json({
            message: error.message,
        })
    }
}

module.exports.updateCompany = async (req, res) => {
    try {
      let { name, description, website, location } = req.body;
  
      // Check if a new file is provided
      const file = req.file;
      let updateData = { name, description, website, location };
  
      if (file) {
        // If file exists, upload to Cloudinary and add the logo URL to updateData
        const fileUri = getDataUri(file);
        const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudinaryResponse.secure_url; // Add logo URL only if a new file is provided
      }
  
      // Update the company data in the database
      const company = await companyModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!company) {
        return res.status(404).json({
          message: "Company not found",
          success: false,
        });
      }
  
      return res.status(200).json({
        message: "Company successfully updated",
        success: true,
        company,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "An error occurred while updating the company",
        success: false,
      });
    }
  };
  