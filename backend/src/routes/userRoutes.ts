import express from "express";
import { updateUser } from "../controller/user/userController";
const router = express.Router();

router.post("/update-profile", updateUser);

export default router;
