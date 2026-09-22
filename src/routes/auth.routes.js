const express = require("express");
const crypto = require("crypto");

const { sendOtpEmail } = require("../services/email.service");

const router = express.Router();

const OTP_EXPIRY_MINUTES = 10;

function generateOtp() {
    return crypto.randomInt(100000, 1000000).toString();
}


// ======================================
// REQUEST OTP
// ======================================

router.post("/request-otp", async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid email is required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Generate 6-digit OTP
        const otp = generateOtp();

        // OTP expires after 10 minutes
        const expiresAt = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        );

        const db = req.app.locals.db;

        // Save OTP in database
        await db.execute(
            `
            INSERT INTO otp_codes
                (email, otp, expires_at)
            VALUES
                (?, ?, ?)
            `,
            [
                normalizedEmail,
                otp,
                expiresAt
            ]
        );

        console.log("OTP generated");
        console.log("Sending OTP to:", normalizedEmail);

        // Send OTP email
        await sendOtpEmail(
            normalizedEmail,
            otp
        );

        console.log("OTP email function completed");

        return res.json({
            success: true,
            message: "OTP sent successfully."
        });

    } catch (error) {

        console.error("Request OTP error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP."
        });
    }
});


// ======================================
// VERIFY OTP
// ======================================

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const normalizedOtp =
            otp.trim();

        // OTP must contain exactly 6 digits
        if (!/^\d{6}$/.test(normalizedOtp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must contain 6 digits."
            });
        }

        const db = req.app.locals.db;

        // Find latest OTP for this email
        const [rows] = await db.execute(
            `
            SELECT
                id,
                otp,
                expires_at
            FROM otp_codes
            WHERE email = ?
            ORDER BY id DESC
            LIMIT 1
            `,
            [normalizedEmail]
        );

        // No OTP found
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found."
            });
        }

        const otpRecord = rows[0];

        // Check expiration
        if (
            new Date(otpRecord.expires_at) < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            });
        }

        // Check OTP
        if (otpRecord.otp !== normalizedOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // OTP is single-use
        await db.execute(
            `
            DELETE FROM otp_codes
            WHERE id = ?
            `,
            [otpRecord.id]
        );

        return res.json({
            success: true,
            message: "OTP verified successfully."
        });

    } catch (error) {

        console.error("Verify OTP error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP."
        });
    }
});


module.exports = router;