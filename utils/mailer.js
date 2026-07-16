const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendMail({ to, subject, html }) {
    try {
        await transporter.sendMail({
            from: `"Job Portal" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Failed to send email:", error.message);
        // don't throw — email failure shouldn't break the status update
    }
}

module.exports = { sendMail };