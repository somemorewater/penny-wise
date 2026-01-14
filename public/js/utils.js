
export function showMessage(message, type = "info") {
  const form = document.querySelector(".auth-form");
  if (form) {
    let inlineMsg = document.querySelector(".auth-message");
    if (!inlineMsg) {
      inlineMsg = document.createElement("div");
      inlineMsg.className = "auth-message";
      form.prepend(inlineMsg);
    }
    inlineMsg.textContent = message;
    inlineMsg.className = `auth-message ${type}`;

    setTimeout(() => inlineMsg.remove(), 3000);
  }

}
