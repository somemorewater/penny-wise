const html = document.documentElement;
const currentTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", currentTheme);


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "./index.html";
  } else {
    showMessage(data.message || "Login failed", "error");
  }
});