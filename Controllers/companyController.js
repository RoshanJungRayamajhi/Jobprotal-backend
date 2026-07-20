const companyModel = require("../models/company-model");
const userModel = require("../models/user-model");
const getDataUri = require("../config/datauriConfig")
const cloudinary = require("../config/cloudinaryConfig")


export const registerCompany = async (req, res) => {
  try {
    const {
      name,
      tagline,
      description,
      industry,
      companySize,
      foundedYear,
      email,
      phone,
      website,
      country,
      state,
      city,
      address,
      benefits,
      culture,
      socialLinks,
      video,
    } = req.body;

    // Logged-in HR
    const creator = req.id;

    // Required field validation
    if (!name || !description || !industry) {
      return res.status(400).json({
        success: false,
        message: "Name, description and industry are required.",
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists.",
      });
    }

    // Upload logo to Cloudinary
    let logo = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudinaryResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "job-portal/company-logo",
        }
      );

      logo = cloudinaryResponse.secure_url;
    }

    // Parse JSON strings if sent as FormData
    let parsedBenefits = [];
    let parsedCulture = [];
    let parsedSocialLinks = {};

    if (benefits) {
      parsedBenefits =
        typeof benefits === "string"
          ? JSON.parse(benefits)
          : benefits;
    }

    if (culture) {
      parsedCulture =
        typeof culture === "string"
          ? JSON.parse(culture)
          : culture;
    }

    if (socialLinks) {
      parsedSocialLinks =
        typeof socialLinks === "string"
          ? JSON.parse(socialLinks)
          : socialLinks;
    }

    // Create company
    const company = await Company.create({
      creator,
      name,
      tagline,
      description,
      industry,
      companySize,
      foundedYear,
      logo,
      email,
      phone,
      website,
      country,
      state,
      city,
      address,
      benefits: parsedBenefits,
      culture: parsedCulture,
      socialLinks: parsedSocialLinks,
      video,
    });

    return res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      company,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while registering the company.",
    });
  }
};

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
  