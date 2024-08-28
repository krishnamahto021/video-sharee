import passport from "passport";
import express from "express";
import authRoute from "./authRoutes";
import userRoute from "./userRoutes";

const router = express.Router();

router.use("/auth", authRoute);

// routes for user
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

export default router;
