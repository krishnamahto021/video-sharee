import express from "express";
import { upload } from "../middleware/multerS3Middleware";
import { uploadFile } from "../controller/aws/awsFileController";
const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);

export default router;
