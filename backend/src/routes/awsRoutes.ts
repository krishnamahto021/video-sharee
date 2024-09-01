import express from "express";
import { upload } from "../middleware/multerS3Middleware";
import {
  deleteVideo,
  updateVideo,
  uploadFile,
} from "../controller/aws/awsFileController";
const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);

router.put("/video/update/:videoId", updateVideo);
router.delete("/video/delete/:videoId", deleteVideo);

export default router;
