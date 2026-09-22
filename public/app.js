const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const otpSection =
    document.getElementById("otpSection");

const otpInput =
    document.getElementById("otp");

const sendOtpButton =
    document.getElementById("sendOtpButton");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");

const message =
    document.getElementById("message");


// ================================
// MESSAGE
// ================================

function showMessage(text) {
    message.textContent = text;
}


// ================================
// SEND OTP
// ================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        if (!email) {
            showMessage(
                "Please enter your email address."
            );

            return;
        }

        sendOtpButton.disabled = true;

        showMessage(
            "Sending OTP..."
        );

        try {

            const response =
                await fetch(
                    "/api/auth/request-otp",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email
                        })
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                showMessage(
                    data.message ||
                    "Unable to send OTP."
                );

                return;
            }

            showMessage(
                "OTP sent successfully."
            );

            // Show OTP section ONLY
            // after successful sending.
            otpSection.hidden = false;

            otpInput.focus();

        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

        } finally {

            sendOtpButton.disabled = false;
        }
    }
);


// ================================
// VERIFY OTP
// ================================

verifyOtpButton.addEventListener(
    "click",
    async () => {

        const email =
            emailInput.value.trim();

        const otp =
            otpInput.value.trim();

        if (!/^\d{6}$/.test(otp)) {

            showMessage(
                "Please enter a valid 6-digit OTP."
            );

            return;
        }

        verifyOtpButton.disabled = true;

        showMessage(
            "Verifying OTP..."
        );

        try {

            const response =
                await fetch(
                    "/api/auth/verify-otp",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            otp
                        })
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                showMessage(
                    data.message ||
                    "Invalid OTP."
                );

                return;
            }

            showMessage(
                "OTP verified successfully."
            );

            emailInput.disabled = true;
            otpInput.disabled = true;

            verifyOtpButton.disabled = true;

            sendOtpButton.disabled = true;

        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

        } finally {

            if (!otpInput.disabled) {
                verifyOtpButton.disabled = false;
            }
        }
    }
);