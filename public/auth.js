// Theme Toggle (works on all pages)
const html = document.documentElement;
const currentTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", currentTheme);

// 🔥 Optional: always act logged-in for UI testing
localStorage.setItem("isLoggedIn", "true");

// Login Form (bypassed)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showMessage("Auth disabled. Redirecting...", "info");

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 500);
  });
}

// Signup Form (bypassed)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showMessage("Signup disabled. UI only.", "info");
  });
}

// Logout (still works for navigation)
function logout() {
  window.location.href = "./login.html";
}

// Show message helper
function showMessage(message, type) {
  const existingMessage = document.querySelector(".auth-message");
  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement("div");
  messageDiv.className = `auth-message ${type}`;
  messageDiv.textContent = message;

  const form = document.querySelector(".auth-form");
  if (form) {
    form.insertBefore(messageDiv, form.firstChild);
    setTimeout(() => messageDiv.remove(), 3000);
  }
}

// Google button placeholder
document.querySelectorAll(".btn-social").forEach((btn) => {
  btn.addEventListener("click", () => {
    showMessage("Social auth disabled.", "info");
  });
});
