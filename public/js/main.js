import { fetchTransactions, initTransactionEvents } from "./transaction.js";

// ===== Auth token from URL =====
const params = new URLSearchParams(window.location.search);
const urlToken = params.get("token");

if (urlToken) {
  localStorage.setItem("token", urlToken);
  window.history.replaceState({}, document.title, "/");
}

// ===== Auth Guard =====
const token = localStorage.getItem("token");

if (!token) {
  window.location.replace("./login.html");
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
