const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === "true",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendOtpEmail(email, otp) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Your Login OTP",

        text: `Your login OTP is ${otp}. It will expire in 10 minutes.`,

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Login Verification</h2>

                <p>Your one-time password is:</p>

                <h1>${otp}</h1>

                <p>This OTP will expire in 10 minutes.</p>

                <p>
                    If you did not request this code,
                    you can ignore this email.
                </p>
            </div>
        `
    });
}

module.exports = {
    sendOtpEmail
};