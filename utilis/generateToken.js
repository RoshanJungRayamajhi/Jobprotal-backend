const jwt = require("jsonwebtoken")

module.exports.generateToken = async (tokenData,res)=>{
 let Token = jwt.sign(tokenData,process.env.JWTSECRET,{
    expiresIn:"15d",
 })
 
  return Token;
}