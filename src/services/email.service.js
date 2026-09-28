const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendOtpEmail(to, otp) {
    console.log("SMTP USER:", process.env.SMTP_USER);
    console.log("SMTP PASS EXISTS:", !!process.env.SMTP_PASS);

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: "Your OTP",
        text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });
}

module.exports = {
    sendOtpEmail
};