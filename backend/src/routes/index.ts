import passport from "passport";
import express from "express";
import authRoute from "./authRoutes";
import userRoute from "./userRoutes";
import awsRoute from "./awsRoutes";
import { fetch6LatestVideos } from "../controller/aws/awsFileController";

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

export default router;
