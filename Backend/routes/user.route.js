const express = require("express");
const router = express.Router();
const {
  register,
  login,
  sendOtp,
  verifyOtp,
  getUserDetails,
  forgotPassword,
  getResetPassword,
} = require("../controllers/user.controller");
router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/getUserDetail", getUserDetails);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", getResetPassword);
module.exports = router;
