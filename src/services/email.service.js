const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendOtpEmail(email, otp) {
    await transporter.sendMail({
        from: `"Login Demo" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    });
}

module.exports = {
    sendOtpEmail
};