// 🚀 Login Validation
function validateLogin() {
    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();
    let errorElement = document.getElementById("login-error");
    let loginBtn = document.getElementById("login-btn"); 
    let loginText = document.getElementById("login-text");
    let spinner = document.getElementById("login-spinner");

    errorElement.innerText = ""; // Clear previous errors

    if (username === "" || password === "") {
        errorElement.innerText = "⚠️ Please fill in all fields.";
        return false;
    }

    // Disable button & show loading animation
    loginBtn.disabled = true;
    loginText.innerText = "Logging in...";
    spinner.classList.remove("hidden");

    setTimeout(() => {
        // Simulated valid credentials (Replace with actual authentication)
        if (username === "admin" && password === "1234567") {
            window.location.href = "index.html"; // Redirect to the main page
        } else {
            errorElement.innerText = "❌ Invalid username or password.";
        }

        // Reset button state after 2 seconds
        loginBtn.disabled = false;
        loginText.innerText = "Login";
        spinner.classList.add("hidden");

    }, 2000); // Adjust timing if needed

    return false; // Prevent default form submission
}


// 🚀 Signup Validation
function validateSignup() {
    let username = document.getElementById("signup-username").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value;
    let confirmPassword = document.getElementById("signup-confirm-password").value;
    let errorElement = document.getElementById("signup-error");

    // Clear previous message
    errorElement.innerText = "";
    errorElement.classList.remove("text-green-400", "text-red-400");

    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        errorElement.innerText = "⚠️ Please fill in all fields.";
        errorElement.classList.add("text-red-400");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorElement.innerText = "⚠️ Enter a valid email.";
        errorElement.classList.add("text-red-400");
        return false;
    }

    if (password.length < 6) {
        errorElement.innerText = "⚠️ Password must be at least 6 characters.";
        errorElement.classList.add("text-red-400");
        return false;
    }

    if (password !== confirmPassword) {
        errorElement.innerText = "⚠️ Passwords do not match.";
        errorElement.classList.add("text-red-400");
        return false;
    }

    errorElement.innerText = "✅ Sign-up successful!";
    errorElement.classList.add("text-green-400");
    return true;
}


// 🚀 Forgot Password Validation
function validateForgotPassword() {
    let email = document.getElementById("forgot-email").value.trim();
    let errorElement = document.getElementById("forgot-error");

    // Clear any previous messages
    errorElement.innerText = "";

    if (email === "") {
        errorElement.innerText = "⚠️ Please enter your email.";
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorElement.innerText = "⚠️ Enter a valid email.";
        return false;
    }

    errorElement.innerText = "📧 A password reset link has been sent to your email.";
    return true;
}


// 🚀 Switch Forms
function showLogin() {
    document.getElementById("login-box").classList.remove("hidden");
    document.getElementById("signup-box").classList.add("hidden");
    document.getElementById("forgot-password-box").classList.add("hidden");
}

function showSignup() {
    document.getElementById("signup-box").classList.remove("hidden");
    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("forgot-password-box").classList.add("hidden");
}

function showForgotPassword() {
    document.getElementById("forgot-password-box").classList.remove("hidden");
    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("signup-box").classList.add("hidden");
}

//cursor
const cursor = document.getElementById("custom-cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});
