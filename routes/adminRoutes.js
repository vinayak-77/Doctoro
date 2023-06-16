const express = require("express");
const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

// GET METHOD || user list

router.get("/getAllUsers", authMiddleware, getAllUsersControllers);

// GET METHOD || doctor list

router.get("/getAllDoctors", authMiddleware, getAllDoctorsControllers);

// POST METHOD || ACCOUNT STATUS

router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
