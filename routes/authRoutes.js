const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);
/* Chính */
router.get("/getProfileById/:id", authController.getProfileById);
router.post("/updateNameById", authController.updateNameById);
router.post("/updateStatusById", authController.updateStatusById);
router.get("/getlistUser", authController.getlistUser);
router.post("/updateBackgroundById", authController.updateBackgroundById);
router.post("/updateAvatarById", authController.updateAvatarById);

// view Routes
router.get("/register", authController.register);
router.get("/login", authController.login);
router.get("/forgot-password", authController.forgot_password);
router.get("/reset-password", authController.reset_password);
router.get("/", authController.index);

module.exports = router;
