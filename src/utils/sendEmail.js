import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_PORT === "465", 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Product App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(" Reset email sent to:", to);
  } catch (error) {
    console.error("Email send failed:",);
    throw error;
  }
};

export default sendEmail;