import passport from "passport";
import express from "express";
import authRoute from "./authRoutes";
import userRoute from "./userRoutes";
import awsRoute from "./awsRoutes";
import {
  downloadVideo,
  fetch6LatestVideos,
  getVideo,
} from "../controller/aws/awsFileController";

const router = express.Router();

router.use("/auth", authRoute);

// routes for user
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

router.use("/aws", passport.authenticate("jwt", { session: false }), awsRoute);

router.get("/fetch-latest-6-videos", fetch6LatestVideos);

router.get("/video/download/:videoId", downloadVideo);
router.get("/video/:videoId", getVideo);

export default router;
