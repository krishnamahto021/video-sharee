import dotenv from "dotenv";
import { sendResponse } from "../../utils/sendResponse";
import { RequestHandler, Request } from "express";
import User from "../../models/userModel";
import {
  compareHashedPassword,
  hashPassword,
} from "../../utils/passwordHelper";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "../../utils/jwtToken";
import { verifyUserEmail } from "../../mailer/verifyUser";
dotenv.config();
interface RegisterReq extends Request {
  body: {
    email: string;
    password: string;
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
    sendResponse(res, 200, true, "Logged in successfully", {
      user: { token: jwtToken },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};
