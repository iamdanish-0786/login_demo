const express = require("express");
const { createOtp, verifyOtp } = require("../services/otp.service");
const { sendOtpEmail } = require("../services/email.service");

const router = express.Router();

router.post("/request-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const otp = await createOtp({
            destination: email,
            method: "email"
        });

        await sendOtpEmail(email, otp);

        return res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP"
        });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const result = await verifyOtp({
            destination: email,
            method: "email",
            otp
        });

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP"
        });
    }
});

module.exports = router;