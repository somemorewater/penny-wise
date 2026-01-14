import { showMessage } from "./utils.js";

const form = document.getElementById("transactionForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Saving...";

    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("Please login first", "error");
      btn.disabled = false;
      btn.textContent = "Save";
      return;
    }

    const transactionData = {
      description: form.transactionDescription.value.trim(),
      amount: Number(form.transactionAmount.value),
      type: form.transactionType.value,
      category: form.transactionCategory.value,
      date: form.transactionDate.value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/createTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to save transaction", "error");
        return;
      }

      showMessage("Transaction saved", "success");
      form.reset();
      document.getElementById("transactionModal").style.display = "none";
    } catch (err) {
      showMessage("Server unreachable", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Save";
    }
  });
}
