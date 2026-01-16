import { fetchTransactions, initTransactionEvents } from "./transaction.js";

// ===== Auth token from URL =====
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("token", token);
  window.history.replaceState({}, document.title, "/");
}

// ===== Theme =====
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

html.setAttribute("data-theme", localStorage.getItem("theme") || "light");

themeToggle.onclick = () => {
  const t = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
};

// ===== Init =====
document.addEventListener("DOMContentLoaded", async () => {
  await fetchTransactions();
  initTransactionEvents();
});

// ===== Logout =====
window.logout = () => {
  localStorage.clear();
  window.location.href = "./login.html";
};
