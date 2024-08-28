import express from "express";
import { getLatestVideos, updateUser } from "../controller/user/userController";
const router = express.Router();

router.post("/update-profile", updateUser);
router.get("/get-latest-videos", getLatestVideos);

export default router;
