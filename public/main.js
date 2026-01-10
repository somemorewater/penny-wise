        // Check Authentication
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = './login.html';
        }

        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        // Transaction Data Storage
        let transactions = [
            { id: 1, date: '2026-01-10', description: 'Grocery Shopping', category: 'food', type: 'expense', amount: 142.50 },
            { id: 2, date: '2026-01-09', description: 'Monthly Salary', category: 'salary', type: 'income', amount: 5500.00 },
            { id: 3, date: '2026-01-08', description: 'Electric Bill', category: 'utilities', type: 'expense', amount: 89.20 },
            { id: 4, date: '2026-01-07', description: 'Freelance Project', category: 'salary', type: 'income', amount: 1200.00 },
            { id: 5, date: '2026-01-06', description: 'Restaurant Dinner', category: 'food', type: 'expense', amount: 67.80 },
            { id: 6, date: '2026-01-05', description: 'Gas Station', category: 'transport', type: 'expense', amount: 45.00 }
        ];

        let nextId = 7;
        let editingId = null;
        let deletingId = null;

        // Category Labels
        const categoryLabels = {
            salary: 'Salary',
            food: 'Food & Dining',
            transport: 'Transportation',
            utilities: 'Utilities',
            entertainment: 'Entertainment',
            shopping: 'Shopping',
            health: 'Healthcare',
            other: 'Other'
        };

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateChartColors();
        });

        // Modal Functions
        const transactionModal = document.getElementById('transactionModal');
        const deleteModal = document.getElementById('deleteModal');
        const transactionForm = document.getElementById('transactionForm');

        function openModal() {
            transactionModal.classList.add('active');
        }

        function closeModal() {
            transactionModal.classList.remove('active');
            transactionForm.reset();
            editingId = null;
            document.getElementById('modalTitle').textContent = 'Add Transaction';
        }

        function openDeleteModal() {
            deleteModal.classList.add('active');
        }

        function closeDeleteModal() {
            deleteModal.classList.remove('active');
            deletingId = null;
        }

        // Format Date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        // Format Amount
        function formatAmount(amount, type) {
            const formatted = amount.toFixed(2);
            return type === "income" ? `+₦${formatted}` : `−₦${formatted}`;
        }

        // Calculate Stats
        function calculateStats() {
            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const balance = 45280 + income - expenses; // Starting balance

            return { balance, income, expenses };
        }

        // Update Dashboard Stats
        function updateStats() {
            const stats = calculateStats();
            
            document.querySelector(
              ".stat-card:nth-child(1) .stat-value"
            ).textContent = `₦${stats.balance.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
            
            document.querySelector(
              ".stat-card:nth-child(2) .stat-value"
            ).textContent = `+₦${stats.income.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
            
            document.querySelector(
              ".stat-card:nth-child(3) .stat-value"
            ).textContent = `−₦${stats.expenses.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
        }

        // Render Transactions
        function renderTransactions(filteredTransactions = null) {
            const transactionsToRender = filteredTransactions || transactions;
            const tbody = document.getElementById('transactionTable');
            
            if (transactionsToRender.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-tertiary);">
                            No transactions found
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = transactionsToRender
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(transaction => `
                    <tr data-id="${transaction.id}">
                        <td class="transaction-date">${formatDate(transaction.date)}</td>
                        <td>${transaction.description}</td>
                        <td><span class="transaction-category">${categoryLabels[transaction.category]}</span></td>
                        <td><span class="transaction-amount ${transaction.type}">${formatAmount(transaction.amount, transaction.type)}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="icon-btn edit-btn" data-id="${transaction.id}" aria-label="Edit">
                                    <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                                <button class="icon-btn delete-btn" data-id="${transaction.id}" aria-label="Delete">
                                    <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');

            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', handleEdit);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', handleDelete);
            });
        }

        // Add Transaction
        document.getElementById('addTransaction').addEventListener('click', () => {
            editingId = null;
            document.getElementById('modalTitle').textContent = 'Add Transaction';
            document.getElementById('transactionDate').valueAsDate = new Date();
            openModal();
        });

        // Handle Form Submit
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                date: document.getElementById('transactionDate').value,
                description: document.getElementById('transactionDescription').value,
                category: document.getElementById('transactionCategory').value,
                type: document.getElementById('transactionType').value,
                amount: parseFloat(document.getElementById('transactionAmount').value)
            };

            if (editingId) {
                // Update existing transaction
                const index = transactions.findIndex(t => t.id === editingId);
                if (index !== -1) {
                    transactions[index] = { ...transactions[index], ...formData };
                }
            } else {
                // Add new transaction
                transactions.push({
                    id: nextId++,
                    ...formData
                });
            }

            updateStats();
            applyFilters();
            closeModal();
        });

        // Handle Edit
        function handleEdit(e) {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            const transaction = transactions.find(t => t.id === id);
            
            if (transaction) {
                editingId = id;
                document.getElementById('modalTitle').textContent = 'Edit Transaction';
                document.getElementById('transactionDate').value = transaction.date;
                document.getElementById('transactionDescription').value = transaction.description;
                document.getElementById('transactionCategory').value = transaction.category;
                document.getElementById('transactionType').value = transaction.type;
                document.getElementById('transactionAmount').value = transaction.amount;
                openModal();
            }
        }

        // Handle Delete
        function handleDelete(e) {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            const transaction = transactions.find(t => t.id === id);
            
            if (transaction) {
                deletingId = id;
                
                // Show transaction details in delete modal
                document.getElementById('deleteTransactionDetails').innerHTML = `
                    <p><strong>Date:</strong> ${formatDate(transaction.date)}</p>
                    <p><strong>Description:</strong> ${transaction.description}</p>
                    <p><strong>Category:</strong> ${categoryLabels[transaction.category]}</p>
                    <p><strong>Amount:</strong> ${formatAmount(transaction.amount, transaction.type)}</p>
                `;
                
                openDeleteModal();
            }
        }

        // Confirm Delete
        document.getElementById('confirmDelete').addEventListener('click', () => {
            if (deletingId) {
                transactions = transactions.filter(t => t.id !== deletingId);
                updateStats();
                applyFilters();
                closeDeleteModal();
            }
        });

        // Modal Close Handlers
        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('cancelTransaction').addEventListener('click', closeModal);
        document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
        document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);

        // Close modal when clicking overlay
        transactionModal.addEventListener('click', (e) => {
            if (e.target === transactionModal) closeModal();
        });

        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });

        // Filters
        function applyFilters() {
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            const category = document.getElementById('category').value;
            const type = document.getElementById('type').value;

            let filtered = [...transactions];

            if (dateFrom) {
                filtered = filtered.filter(t => t.date >= dateFrom);
            }

            if (dateTo) {
                filtered = filtered.filter(t => t.date <= dateTo);
            }

            if (category !== 'all') {
                filtered = filtered.filter(t => t.category === category);
            }

            if (type !== 'all') {
                filtered = filtered.filter(t => t.type === type);
            }

            renderTransactions(filtered);
        }

        // Add event listeners to filters
        document.getElementById('dateFrom').addEventListener('change', applyFilters);
        document.getElementById('dateTo').addEventListener('change', applyFilters);
        document.getElementById('category').addEventListener('change', applyFilters);
        document.getElementById('type').addEventListener('change', applyFilters);

        // Chart Configuration
        const getChartColors = () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            return {
                text: isDark ? '#a3a3a3' : '#57534e',
                grid: isDark ? '#404040' : '#e7e5e4',
                accent: isDark ? '#14b8a6' : '#0f766e',
                positive: isDark ? '#10b981' : '#059669',
                negative: isDark ? '#ef4444' : '#dc2626'
            };
        };

        // Monthly Trends Chart
        const trendsCtx = document.getElementById('trendsChart').getContext('2d');
        const colors = getChartColors();
        
        const trendsChart = new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [
                    {
                        label: 'Income',
                        data: [5200, 5500, 5100, 5800, 5400, 5600, 5500],
                        borderColor: colors.positive,
                        backgroundColor: colors.positive + '20',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: [3200, 3800, 3400, 4100, 3600, 3900, 3500],
                        borderColor: colors.negative,
                        backgroundColor: colors.negative + '20',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: colors.text,
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                family: "'IBM Plex Sans', sans-serif"
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: colors.grid,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.text,
                            font: {
                                size: 11,
                                family: "'IBM Plex Sans', sans-serif"
                            },
                            callback: function(value) {
                                return "₦" + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.text,
                            font: {
                                size: 11,
                                family: "'IBM Plex Sans', sans-serif"
                            }
                        }
                    }
                }
            }
        });

        // Category Breakdown Chart
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        
        const categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Food & Dining', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare'],
                datasets: [{
                    data: [1250, 680, 420, 380, 620, 280],
                    backgroundColor: [
                        '#0f766e',
                        '#14b8a6',
                        '#2dd4bf',
                        '#5eead4',
                        '#99f6e4',
                        '#ccfbf1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: colors.text,
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                family: "'IBM Plex Sans', sans-serif"
                            }
                        }
                    }
                }
            }
        });

        // Update chart colors on theme change
        function updateChartColors() {
            const colors = getChartColors();
            
            trendsChart.data.datasets[0].borderColor = colors.positive;
            trendsChart.data.datasets[0].backgroundColor = colors.positive + '20';
            trendsChart.data.datasets[1].borderColor = colors.negative;
            trendsChart.data.datasets[1].backgroundColor = colors.negative + '20';
            trendsChart.options.plugins.legend.labels.color = colors.text;
            trendsChart.options.scales.y.grid.color = colors.grid;
            trendsChart.options.scales.y.ticks.color = colors.text;
            trendsChart.options.scales.x.ticks.color = colors.text;
            trendsChart.update();
            
            categoryChart.options.plugins.legend.labels.color = colors.text;
            categoryChart.update();
        }

        // Initialize
        renderTransactions();
        updateStats();

        // Logout function
        function logout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberMe');
            window.location.href = './login.html';
        }

        // Make logout function available globally
        window.logout = logout;