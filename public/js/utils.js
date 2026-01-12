export function showMessage(message, type = "info") {
  let msg = document.querySelector(".auth-message");

  if (!msg) {
    msg = document.createElement("div");
    msg.className = "auth-message";

    const form = document.querySelector(".auth-form");
    form.prepend(msg);
  }

  msg.textContent = message;
  msg.className = `auth-message ${type}`;

  setTimeout(() => msg.remove(), 3000);
}
