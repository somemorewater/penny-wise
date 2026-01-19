import { showMessage } from "./utils.js";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = loginForm.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.textContent = "Logging in…";

  showMessage("Logging in...", "info");

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const res = await fetch("https://penny-wise-z9b9.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || "Invalid email or password", "error");
      btn.disabled = false;
      btn.textContent = "Login";

      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = loginForm.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.textContent = "Logging in…";

        showMessage("Logging in...", "info");

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
          const res = await fetch("https://penny-wise-z9b9.onrender.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            showMessage(data.message || "Invalid email or password", "error");
            btn.disabled = false;
            btn.textContent = "Login";
            return;
          }

          showMessage("Login successful", "success");
          localStorage.setItem("token", data.token);

          setTimeout(() => {
            window.location.href = "./index.html";
          }, 800);
        } catch (err) {
          showMessage("Server unreachable", "error");
          btn.disabled = false;
          btn.textContent = "Login";
        }
      });

      return;
    }

    showMessage("Login successful", "success");
    localStorage.setItem("token", data.token);

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 800);
  } catch (err) {
    showMessage("Server unreachable", "error");
    btn.disabled = false;
    btn.textContent = "Login";
  }
});
