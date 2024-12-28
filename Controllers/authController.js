const userModel = require("../models/user-model")
const { generateToken } = require("../utilis/generateToken")
const { hashpass, comparePass, hashedPass } = require("../utilis/hashedPass")
const cloudinary = require("../config/cloudinaryConfig")
const streamifier = require("streamifier")
const getDataUri = require("../config/datauriConfig")

module.exports.register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body

        const file = req.file
        const fileUri = getDataUri(file)
        const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content)


        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(404).json({
                message: "Please enter all fields",
                success: false,
            })
        }
        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            })
        }
        let hashpass = await hashedPass(password)
        user = await userModel.create({
            fullname,
            email,
            phoneNumber,
            password: hashpass,
            role,
            profile: {
                profilePhoto: cloudinaryResponse.secure_url,
            }
        })
        const tokendata = {
            userId: user._id,
        }
        console.log(tokendata);
        const token = await generateToken(tokendata, res)
        res.cookie("token", token, {
            maxage: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        user = await userModel.findById(user._id).select("-password")
        res.status(200).json({
            message: "User registered ",
            success: true,
            user
        })


    } catch (error) {
        res.status(400).json({
            message: error.message,
        })

    }
}
module.exports.login = async (req, res) => {
    try {
        let { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(404).json({
                message: "Please enter all fields",
                success: false,
            })
        }
        let user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "Please register first"
            })
        }
        const isPasswordMatch = await comparePass(password, user.password, res)
        if (!isPasswordMatch) {
            return res.status(404).json({
                message: "Invalid Credentials",
                success: false,
            })
        }
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesnot exist with current role",
                success: false,
            })
        }

        const tokendata = {
            userId: user._id,
        }
        const token = await generateToken(tokendata, res)
        res.cookie("token", token, {
            maxage: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }
        return res.status(200).json({
            message: `Welcome back ${user.fullname}`,
            success: true,

            user,
        })


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token")
    res.status(200).json({message:"Logout successfully",success:true})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
    
};


module.exports.updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        const userId = req.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Update fields if provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) {
            // Split the input string into an array and combine it with existing skills
            const newSkills = skills.split(",").map(skill => skill.trim()); // Trim to remove extra spaces
            const uniqueSkills = Array.from(new Set([...user.profile.skills, ...newSkills])); // Remove duplicates
            user.profile.skills = uniqueSkills;
        }

        // Handle file upload
        try {
          if(file){
            const fileUri = getDataUri(file);
            const { secure_url } = await cloudinary.uploader.upload(fileUri.content, {
              resource_type: "auto",
            });
            user.profile.resume = secure_url;
            user.profile.resumeOriginalName = file.originalname;
          }
          } catch (error) {
            console.error("Cloudinary upload error:", error.message);
          }
        await user.save();
        const updatedUser = await userModel.findById(userId).select("-password");

        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ message: "User update failed", success: false });
    }
};

























