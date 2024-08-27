import jwt from "jsonwebtoken";
import { Iuser } from "../models/userModel";
import dotenv from "dotenv";
dotenv.config();
export const generateJwtToken = async (user: Iuser): Promise<string> => {
  const secretKey = process.env.JWT_SECRET_KEY as string;
  const jwtToken = await jwt.sign(user.toJSON(), secretKey, {
    expiresIn: "1d",
  });

  return jwtToken;
};
