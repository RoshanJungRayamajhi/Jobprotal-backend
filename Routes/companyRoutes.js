const express = require("express")
const { isAuth } = require("../middlewares/isAuth")
const { registerCompany, getCompany, getCompanybyId, updateCompany } = require("../Controllers/companyController")
const router = express.Router()
const upload = require("../config/multer")

router.post("/register",isAuth,registerCompany)
router.get("/get",isAuth,getCompany) 
router.get("/get/:id",isAuth,getCompanybyId)
router.post("/update/:id",isAuth,upload.single("file"),updateCompany)

module.exports = router
