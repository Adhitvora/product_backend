import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });


        await transporter.sendMail({
            from: `"Product App" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Reset email sent to:", to);
    } catch (error) {
        console.error("Email send failed:", error);
        throw error;
    }
};

export default sendEmail;
