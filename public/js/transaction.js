// ================= STATE =================
let transactions = [];
let editingId = null;
let deletingId = null;

const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

// ================= DOM ELEMENTS =================
const transactionForm = document.getElementById("transactionForm");
const transactionDate = document.getElementById("transactionDate");
const transactionDescription = document.getElementById(
  "transactionDescription"
);
const transactionCategory = document.getElementById("transactionCategory");
const transactionType = document.getElementById("transactionType");
const transactionAmount = document.getElementById("transactionAmount");

const addTransactionBtn = document.getElementById("addTransaction");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelTransactionBtns = document.querySelectorAll(".cancel-btn");
const cancelDeleteBtns = document.querySelectorAll(".delete-cancel-btn");

// ================= CHART SETUP =================
const trendsChart = new Chart(document.getElementById("trendsChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Income", data: [] },
      { label: "Expenses", data: [] },
    ],
  },
});

const categoryChart = new Chart(document.getElementById("categoryChart"), {
  type: "doughnut",
  data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
  options: { plugins: { legend: { position: "bottom" } } },
});

// ================= FETCH =================
export async function fetchTransactions() {
  const res = await fetch(`${API}/transaction`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

  transactions = await res.json();
  renderTransactions();
  updateStats();
  updateCharts();
}

// ================= CREATE / UPDATE =================
async function saveTransaction(data) {
  const url = editingId
    ? `${API}/updateTransaction/${editingId}`
    : `${API}/createTransaction`;

  const method = editingId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });

  editingId = null;
  closeModal();
  fetchTransactions();
}

// ================= DELETE =================
async function deleteTransaction() {
  await fetch(`${API}/deleteTransaction/${deletingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token()}` },
  });

  deletingId = null;
  closeDeleteModal();
  fetchTransactions();
}

// ================= RENDER TABLE =================
function renderTransactions() {
  const tbody = document.getElementById("transactionTable");

  if (!transactions.length) {
    tbody.innerHTML = `<tr><td colspan="5">No transactions</td></tr>`;
    return;
  }

  tbody.innerHTML = transactions
    .map(
      (t) => `
      <tr>
        <td>${new Date(t.date).toDateString()}</td>
        <td>${t.description}</td>
        <td>${t.category}</td>
        <td class="${t.type}">${t.type === "income" ? "+" : "-"}₦${
        t.amount
      }</td>
        <td>
          <div class="action-buttons">
            <button class="icon-btn edit-btn" data-edit="${
              t._id
            }" aria-label="Edit">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button class="icon-btn delete-btn" data-del="${
              t._id
            }" aria-label="Delete">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

// ================= STATS =================
function updateStats() {
  let income = 0,
    expense = 0;

  transactions.forEach((t) =>
    t.type === "income" ? (income += t.amount) : (expense += t.amount)
  );

  document.querySelector(
    ".stat-card:nth-child(1) .stat-value"
  ).textContent = `₦${income - expense}`;
  document.querySelector(
    ".stat-card:nth-child(2) .stat-value"
  ).textContent = `+₦${income}`;
  document.querySelector(
    ".stat-card:nth-child(3) .stat-value"
  ).textContent = `-₦${expense}`;
}

// ================= CHART LOGIC =================
function updateCharts() {
  // Monthly trends
  const income = {},
    expense = {};

  transactions.forEach((t) => {
    const m = new Date(t.date).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (t.type === "income") income[m] = (income[m] || 0) + t.amount;
    else expense[m] = (expense[m] || 0) + t.amount;
  });

  const labels = [
    ...new Set([...Object.keys(income), ...Object.keys(expense)]),
  ];
  trendsChart.data.labels = labels;
  trendsChart.data.datasets[0].data = labels.map((l) => income[l] || 0);
  trendsChart.data.datasets[1].data = labels.map((l) => expense[l] || 0);
  trendsChart.update();

  // Category breakdown
  const categories = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach(
      (t) => (categories[t.category] = (categories[t.category] || 0) + t.amount)
    );

  const catLabels = Object.keys(categories);
  const catData = Object.values(categories);
  const colors = catLabels.map(
    (_, i) =>
      [
        "#4ade80",
        "#60a5fa",
        "#f87171",
        "#fbbf24",
        "#a78bfa",
        "#34d399",
        "#fb7185",
      ][i % 7]
  );

  categoryChart.data.labels = catLabels;
  categoryChart.data.datasets[0].data = catData;
  categoryChart.data.datasets[0].backgroundColor = colors;
  categoryChart.update();
}

// ================= EVENTS =================
export function initTransactionEvents() {
  // Open modal
  addTransactionBtn.onclick = openModal;

  // Form submit
  transactionForm.onsubmit = (e) => {
    e.preventDefault();
    saveTransaction({
      date: transactionDate.value,
      description: transactionDescription.value,
      category: transactionCategory.value,
      type: transactionType.value,
      amount: Number(transactionAmount.value),
    });
  };

  // Action buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
      editingId = e.target.closest(".edit-btn").dataset.edit;
      const t = transactions.find((x) => x._id === editingId);
      fillForm(t);
      openModal();
    }
    if (e.target.closest(".delete-btn")) {
      deletingId = e.target.closest(".delete-btn").dataset.del;
      openDeleteModal();
    }
  });

  // Confirm delete
  confirmDeleteBtn.onclick = deleteTransaction;

  // Cancel buttons
  cancelTransactionBtns.forEach((btn) => (btn.onclick = closeModal));
  cancelDeleteBtns.forEach((btn) => (btn.onclick = closeDeleteModal));
}

// ================= MODALS =================
function fillForm(t) {
  transactionDate.value = t.date.split("T")[0];
  transactionDescription.value = t.description;
  transactionCategory.value = t.category;
  transactionType.value = t.type;
  transactionAmount.value = t.amount;
}

function openModal() {
  document.getElementById("transactionModal").classList.add("active");
}

function closeModal() {
  document.getElementById("transactionModal").classList.remove("active");
  transactionForm.reset();
}

function openDeleteModal() {
  document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.remove("active");
}
