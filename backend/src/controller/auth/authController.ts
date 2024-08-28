import dotenv from "dotenv";
import { sendResponse } from "../../utils/sendResponse";
import { RequestHandler, Request } from "express";
import User from "../../models/userModel";
import crypto from "crypto";
import {
  compareHashedPassword,
  hashPassword,
} from "../../utils/passwordHelper";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "../../utils/jwtToken";
import { verifyUserEmail } from "../../mailer/verifyUser";
import { resetPasswordEmail } from "../../mailer/resetPassword";
import { name } from "ejs";
dotenv.config();
interface RegisterReq extends Request {
  body: {
    email: string;
    password: string;
  };
}
interface ResetPasswordReq extends Request {
  body: {
    email: string;
  };
}
export const signUpUser: RequestHandler = async (req: RegisterReq, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, true, "User already exists ");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await verifyUserEmail(newUser);
    return sendResponse(res, 200, true, "user created successfully ");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Something went wrong ");
  }
};

export const signInUser: RequestHandler = async (req: RegisterReq, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, false, "User doesnot exists");
    }
    const matchedPassword = await compareHashedPassword(
      password,
      user.password
    );
    if (!matchedPassword) {
      return sendResponse(res, 400, false, "Password doesnot match");
    }
    const jwtToken = await generateJwtToken(user);
    const { name } = user;
    sendResponse(res, 200, true, "Logged in successfully", {
      user: { token: jwtToken, name, email },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};

export const verifyUser: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return sendResponse(res, 400, false, "No such validation token found");
    }
    const user = await User.findOne({ token });
    if (!user) {
      sendResponse(res, 400, false, "Validation failed");
    }
    sendResponse(res, 200, true, "Validation successfull");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};

export const sendEmailForResetPassword: RequestHandler = async (
  req: ResetPasswordReq,
  res
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, 400, false, "Please provide your email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, false, "Not a registered email");
    }
    await resetPasswordEmail(user);
    sendResponse(res, 200, true, "Check your email to reset your password");
  } catch (error) {
    console.error(
      `error in sending the reset password email from controller ${error}`
    );
    sendResponse(res, 500, false, "Internal server error");
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) {
      return sendResponse(res, 400, false, "Not a valid token try again !");
    }
    const user = await User.findOne({ token });
    if (!user) {
      return sendResponse(res, 400, false, "Not a valid email");
    }
    user.password = user.password;
    user.token = crypto.randomBytes(16).toString("hex");
    await user.save();
    sendResponse(res, 200, true, "Password reset successully ");
  } catch (error) {
    console.error(`Error in reseting the password`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
