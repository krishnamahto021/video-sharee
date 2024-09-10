import express from "express";
import {
  getLatestVideosForUser,
  getUserDetails,
  updateUser,
} from "../controller/user/userController";
const router = express.Router();

router.get("/details", getUserDetails);
router.post("/update-profile", updateUser);
router.get("/get-latest-videos", getLatestVideosForUser);

export default router;
