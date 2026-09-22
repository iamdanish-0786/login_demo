const crypto = require("crypto");
const pool = require("../config/database");

function generateOtp() {
    return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp) {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
}

async function createOtp({ userId = null, destination, method }) {
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.execute(
        `INSERT INTO otp_verifications
        (user_id, destination, method, otp_hash, expires_at)
        VALUES (?, ?, ?, ?, ?)`,
        [userId, destination, method, otpHash, expiresAt]
    );

    return otp;
}

async function verifyOtp({ destination, method, otp }) {
    const [rows] = await pool.execute(
        `SELECT *
         FROM otp_verifications
         WHERE destination = ?
           AND method = ?
           AND verified_at IS NULL
         ORDER BY created_at DESC
         LIMIT 1`,
        [destination, method]
    );

    if (rows.length === 0) {
        return { success: false, reason: "OTP_NOT_FOUND" };
    }

    const record = rows[0];

    if (new Date(record.expires_at) < new Date()) {
        return { success: false, reason: "OTP_EXPIRED" };
    }

    if (record.attempts >= 5) {
        return { success: false, reason: "TOO_MANY_ATTEMPTS" };
    }

    const otpHash = hashOtp(otp);

    if (otpHash !== record.otp_hash) {
        await pool.execute(
            `UPDATE otp_verifications
             SET attempts = attempts + 1
             WHERE id = ?`,
            [record.id]
        );

        return { success: false, reason: "INVALID_OTP" };
    }

    await pool.execute(
        `UPDATE otp_verifications
         SET verified_at = NOW()
         WHERE id = ?`,
        [record.id]
    );

    return {
        success: true,
        userId: record.user_id
    };
}

module.exports = {
    createOtp,
    verifyOtp
};