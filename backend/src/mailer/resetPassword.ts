import { transporter } from "./../config/nodemailer";
import ejs from "ejs";
import path from "path";
import { Iuser } from "./../models/userModel";

export const resetPasswordEmail = async (user: Iuser) => {
  try {
    let emailHtml = await ejs.renderFile(
      path.join(__dirname, "../view/resetPassword.ejs"),
      { token: user.token }
    );
    const options = {
      from: process.env.EMAIL,
      to: user.email,
      subject: `Reset your password`,
      html: emailHtml,
    };
    await transporter.sendMail(options);
  } catch (error) {
    console.error(`Error in sending reset password mail ${error}`);
  }
};
