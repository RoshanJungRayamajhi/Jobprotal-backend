const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isAuth = async (req,res, next )=>{
    try {
      
        const token = req.cookies.token;
        if(!token) return res.status(401).json({
            message:"unauthorized"
        })
        let decodeddata = jwt.decode(token, process.env.JWTSECRET)
        if(!decodeddata) return res.status(403).json({message:"jwt token expird"})
        req.id =decodeddata.userId,
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}