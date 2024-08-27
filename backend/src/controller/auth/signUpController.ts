import { sendResponse } from "./../../utils/sendResponse";
import { RequestHandler, Request } from "express";
import User from "../../models/userModel";

interface RegisterReq extends Request {
  body: {
    email: string;
    password: string;
  };
}
export const createUser: RequestHandler = async (req: RegisterReq, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, true, "User already exists ");
    }
    await User.create({
      email,
      password,
    });
    return sendResponse(res, 200, true, "user created successfully ");
  } catch (error) {
    console.error(error);

    return sendResponse(res, 500, false, "Something went wrong ");
  }
};
