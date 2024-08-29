import express from "express";
import {
  getLatestVideosForUser,
  updateUser,
} from "../controller/user/userController";
const router = express.Router();

router.post("/update-profile", updateUser);
router.get("/get-latest-videos", getLatestVideosForUser);

export default router;
