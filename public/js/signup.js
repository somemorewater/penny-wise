import { showMessage } from "./utils.js";

const passwordInput = document.querySelector("#password");
const strengthBar = document.querySelector(".strength-bar");
const signupForm = document.querySelector("#signupForm");

// Password strength
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  strengthBar.className = "strength-bar";

  if (password.length === 0) return;

  const strength = getStrength(password);

  if (strength === 1) strengthBar.classList.add("weak");
  if (strength === 2) strengthBar.classList.add("medium");
  if (strength === 3) strengthBar.classList.add("good");
  if (strength === 4) strengthBar.classList.add("strong");
});

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

// Signup submit
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = signupForm.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Creating account…";

    showMessage("Creating account…", "info");

    try {
      const res = await fetch(
        "https://penny-wise-z9b9.onrender.com/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: signupForm.fullName.value,
            email: signupForm.email.value,
            password: signupForm.password.value,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Signup failed", "error");
        btn.disabled = false;
        btn.textContent = "Create Account";
        return;
      }

      showMessage("Account created", "success");
      localStorage.setItem("token", data.token);

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 800);
    } catch (err) {
      showMessage("Server not reachable", "error");
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  });
}
