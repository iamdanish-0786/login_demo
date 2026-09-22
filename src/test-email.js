require("dotenv").config();

const { sendOtpEmail } = require("./services/email.service");

async function testEmail() {
    try {
        await sendOtpEmail(
            "backupvideos019@gmail.com",
            "987652"
        );

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending failed:");
        console.error(error);
    }
}

testEmail();