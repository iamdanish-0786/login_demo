const authDialog = document.getElementById("authDialog");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authSwitch = document.getElementById("authSwitch");
const authFeedback = document.getElementById("authFeedback");
const closeAuthButton = document.getElementById("closeAuth");

function setAuthView(view) {
    const isRegister = view === "register";

    registerForm.hidden = !isRegister;
    loginForm.hidden = isRegister;
    authTitle.textContent = isRegister ? "Create your account" : "Welcome back";
    authSubtitle.textContent = isRegister
        ? "Save the places you dream of seeing."
        : "Pick up where your next journey begins.";
    authSwitch.innerHTML = isRegister
        ? 'Already have an account? <button type="button" data-open-auth="login">Log in</button>'
        : 'New around here? <button type="button" data-open-auth="register">Create an account</button>';
    authFeedback.textContent = "";
    (isRegister ? registerForm : loginForm).reset();
}

function openAuth(view) {
    setAuthView(view);

    if (!authDialog.open) {
        authDialog.showModal();
    }
}

document.addEventListener("click", (event) => {
    const authButton = event.target.closest("[data-open-auth]");

    if (authButton) {
        openAuth(authButton.dataset.openAuth);
    }
});

closeAuthButton.addEventListener("click", () => authDialog.close());

authDialog.addEventListener("click", (event) => {
    if (event.target === authDialog) {
        authDialog.close();
    }
});

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    authFeedback.textContent = "Registration is ready to connect to the account service.";
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    authFeedback.textContent = "Sign-in is ready to connect to the account service.";
});

document.getElementById("logoutButton").addEventListener("click", () => {
    document.getElementById("logoutButton").hidden = true;
});