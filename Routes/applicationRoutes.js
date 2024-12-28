const express = require("express")
const { applyjob, getAppliedJobs, getApplicants, updateStatus } = require("../Controllers/applicationController")
const { isAuth } = require("../middlewares/isAuth")

const router = express.Router()

router.post("/apply/:id", isAuth ,applyjob)
// yo hamro profile page ma hunxaaa......
router.get("/get",isAuth,getAppliedJobs)

// yo admin job table ma hunxaaa......
router.get("/get/:id",isAuth,getApplicants)
router.post("/status/:id/update",isAuth,updateStatus)

module.exports = router