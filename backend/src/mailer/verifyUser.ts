import { Iuser } from "./../models/userModel";
import { transporter } from "../config/nodemailer";

export const verifyUserEmail = async (user: Iuser) => {
  try {
    let emailHtml = "<h1> Hello </h1>";
    const options = {
      from: process.env.EMAIL,
      to: user.email,
      subject: `Verify your email to continue`,
      html: emailHtml,
    };
    await transporter.sendMail(options);
  } catch (error) {
    console.error(`Error in sending mail ${error}`);
  }
};
