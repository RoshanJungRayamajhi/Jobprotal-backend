const express = require("express")
const { register, login, logout, updateProfile } = require("../Controllers/authController")
const { isAuth } = require("../middlewares/isAuth")
const upload = require("../config/multer")
const router = express.Router()

router.post("/register", upload.single("file") ,register)
router.post("/login",login)
router.get("/logout",logout)
router.post("/update",isAuth,upload.single("file"),updateProfile)






module.exports = router