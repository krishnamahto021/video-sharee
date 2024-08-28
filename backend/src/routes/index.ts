import passport from "passport";
import express from "express";
import authRoute from "./authRoutes";
import userRoute from "./userRoutes";
import awsRoute from "./awsRoutes";

const router = express.Router();

router.use("/auth", authRoute);

// routes for user
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

router.use("/aws", passport.authenticate("jwt", { session: false }), awsRoute);

export default router;
