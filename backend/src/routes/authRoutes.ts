import express from "express";
import {
  signInUser,
  signUpUser,
  verifyUser,
} from "../controller/auth/authController";

const router = express.Router();

router.post("/sign-up", signUpUser);
router.post("/sign-in", signInUser);
router.get("/verify-user/:token", verifyUser);

export default router;
