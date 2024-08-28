import express from "express";
import {
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

export default router;
