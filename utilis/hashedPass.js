const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
module.exports.hashedPass = async (password)=>{
   return await bcrypt.hash(password,10)
}

module.exports.comparePass = async (plainPass,password,res)=>{
try {
   return await bcrypt.compare(plainPass,password)
} catch (error) {
   res.json({
      message:error.message,
   })
}
}
