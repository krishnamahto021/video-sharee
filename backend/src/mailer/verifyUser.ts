import { Iuser } from "./../models/userModel";
import { transporter } from "../config/nodemailer";
import ejs from "ejs";
import path from "path";

export const verifyUserEmail = async (user: Iuser) => {
  try {
    let emailHtml = await ejs.renderFile(
      path.join(__dirname, "../view/verifyUserEmail.ejs"),
      { token: user.token }
    );
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
