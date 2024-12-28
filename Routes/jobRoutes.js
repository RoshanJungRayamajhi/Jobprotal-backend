const express = require("express")
const { isAuth } = require("../middlewares/isAuth")
const { registerCompany, getCompany, getCompanybyId, updateCompany } = require("../Controllers/companyController")
const { postjob, getAllJobs, getJobById, getAdminJob } = require("../Controllers/jobController")
const router = express.Router()

router.post("/post",isAuth,postjob)
router.get("/getall",getAllJobs) 
router.get("/get/adminjob",isAuth,getAdminJob)
router.get("/get/:id",getJobById)

module.exports = router