const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

router.post("/updateProfile", authMiddleware, updateProfileController);

router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
