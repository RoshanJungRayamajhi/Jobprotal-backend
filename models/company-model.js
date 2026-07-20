const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // HR who created the company
    creator:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true,
        },

    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companynumber:{
        type: String,
    },

    tagline: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    industry: {
      type: String,
      required: true,
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
      default: "1-10",
    },

    foundedYear: {
      type: Number,
    },

    // Branding
    logo: {
      type: String,
      default: "",
    },

  

    // Contact
    hrname:{
        type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    // Location
    country: String,
    state: String,
    city: String,
    address: String,

    // Social Links
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },

    // Employee Benefits
    benefits: [
      {
        type: String,
      },
    ],

    // Company Culture
    culture: [
      {
        type: String,
      },
    ],

    // Gallery Images
    gallery: [
      {
        type: String,
      },
    ],

    // Optional company intro video
    video: {
      type: String,
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // Active/Inactive Company
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

     jobs:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Job"
            }
        ]
    },{
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema)