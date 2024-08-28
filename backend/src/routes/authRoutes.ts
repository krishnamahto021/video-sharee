import express from "express";
import {
  resetPassword,
  sendEmailForResetPassword,
  signInUser,
  signUpUser,
  verifyUser,
} from "../controller/auth/authController";

const router = express.Router();

router.post("/sign-up", signUpUser);
router.post("/sign-in", signInUser);
router.get("/verify-user/:token", verifyUser);
router.post("/send-reset-password-email", sendEmailForResetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
