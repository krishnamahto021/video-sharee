import express from "express";
import { createUser } from "../controller/auth/signUpController";

const router = express.Router();

router.post("/sign-up", createUser);

export default router;
