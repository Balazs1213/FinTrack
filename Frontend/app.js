const API_BASE_URL = 'http://localhost:5062/api';

// Get DOM elements - with null-safe checks
const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.getElementById('close-modal');
const darkModeToggle = document.getElementById('darkModeToggle');
const logoutBtn = document.getElementById('logout-btn');
const transactionForm = document.getElementById('transaction-form');
const transactionsBody = document.getElementById('transactions-body');
const usernameDisplay = document.getElementById('username-display');
const filterBtn = document.getElementById('filter-btn');
const resetBtn = document.getElementById('reset-btn');

let expenseChart = null;
let allTransactions = []; // Store all transactions globally

// Toggle between login and register forms
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginFormContainer) loginFormContainer.style.display = 'none';
        if (registerFormContainer) registerFormContainer.style.display = 'block';
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (registerFormContainer) registerFormContainer.style.display = 'none';
        if (loginFormContainer) loginFormContainer.style.display = 'block';
    });
}

// Settings Modal Controls - with null checks
if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });
}

if (closeModal && settingsModal) {
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
}

// Close modal when clicking outside of it
globalThis.addEventListener('click', (event) => {
    if (settingsModal && event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Dark Mode Toggle - with null check
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        // Redraw chart with correct text color
        if (allTransactions.length > 0) {
            renderChart(allTransactions);
        }
    });
}

// Apply saved theme on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }
}

// Login function
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;

        try {
            const response = await fetch(`${API_BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Choose storage based on Remember Me checkbox
                const storage = rememberMe ? localStorage : sessionStorage;
                
                // Save token and userId to chosen storage
                storage.setItem('token', data.token);
                storage.setItem('userId', data.user.id);
                storage.setItem('username', data.user.username);

                // Show success message
                alert('Login Successful!');

                // Hide auth section and show dashboard
                if (authSection) authSection.style.display = 'none';
                if (dashboard) dashboard.style.display = 'block';
                if (usernameDisplay) usernameDisplay.textContent = data.user.username;

                // Load transactions
                await loadTransactions();

                // Clear form
                loginForm.reset();
            } else {
                alert(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

// Register function
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/Auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                // Switch to login form
                if (registerFormContainer) registerFormContainer.style.display = 'none';
                if (loginFormContainer) loginFormContainer.style.display = 'block';
                // Clear form
                registerForm.reset();
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

// Filter transactions
function filterTransactions() {
    const startDate = document.getElementById('filter-start-date')?.value || '';
    const endDate = document.getElementById('filter-end-date')?.value || '';
    const type = document.getElementById('filter-type')?.value || '';

    let filtered = [...allTransactions];

    // Validate date range if both dates are provided
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            alert('Hiba: A kezdő dátum nem lehet későbbi, mint a végdátum!');
            const endDateInput = document.getElementById('filter-end-date');
            if (endDateInput) endDateInput.value = '';
            return; // Stop execution
        }
    }

    // Filter by start date (inclusive, date only)
    if (startDate) {
        const filterStartDate = new Date(startDate);
        filterStartDate.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.date);
            transactionDate.setHours(0, 0, 0, 0);
            return transactionDate >= filterStartDate;
        });
    }

    // Filter by end date (inclusive, date only)
    if (endDate) {
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.date);
            return new Date(transactionDate) <= filterEndDate;
        });
    }

    // Filter by type
    if (type) {
        filtered = filtered.filter(t => t.type === type);
    }

    // Update UI with filtered data
    renderTransactions(filtered);
    updateSummary(filtered);
    renderChart(filtered);
}

// Reset filters
function resetFilters() {
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const filterType = document.getElementById('filter-type');
    
    if (filterStartDate) filterStartDate.value = '';
    if (filterEndDate) filterEndDate.value = '';
    if (filterType) filterType.value = '';
    
    // Show all transactions
    renderTransactions(allTransactions);
    updateSummary(allTransactions);
    renderChart(allTransactions);
}

// Add event listeners for filter buttons
if (filterBtn) {
    filterBtn.addEventListener('click', filterTransactions);
}

if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
}

// Helper function to get user data from storage
function getUserFromStorage() {
    // Check localStorage first
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');
    
    // If not in localStorage, check sessionStorage
    if (!token || !userId) {
        token = sessionStorage.getItem('token');
        userId = sessionStorage.getItem('userId');
        username = sessionStorage.getItem('username');
    }
    
    return { token, userId, username };
}

// Load transactions
async function loadTransactions() {
    const { userId, token } = getUserFromStorage();

    if (!userId || !token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/Transactions/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            allTransactions = await response.json();
            renderTransactions(allTransactions);
            updateSummary(allTransactions);
            renderChart(allTransactions);
        } else {
            console.error('Failed to load transactions');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render transactions in table
function renderTransactions(transactions) {
    if (!transactionsBody) return;
    
    transactionsBody.innerHTML = '';

    if (transactions.length === 0) {
        transactionsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No transactions found</td></tr>';
        return;
    }

    for (const transaction of transactions) {
        const row = document.createElement('tr');
        const date = new Date(transaction.date).toLocaleDateString();
        const typeClass = transaction.type === 'Income' ? 'type-income' : 'type-expense';
        const amountPrefix = transaction.type === 'Income' ? '+' : '-';
        
        row.innerHTML = `
            <td>${date}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description || '-'}</td>
            <td><span class="badge ${typeClass}">${transaction.type}</span></td>
            <td class="${typeClass}">${amountPrefix}$${transaction.amount.toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </td>
        `;
        transactionsBody.appendChild(row);
    }
}

// Update summary cards
function updateSummary(transactions) {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    }

    const balance = totalIncome - totalExpense;

    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');
    
    if (totalIncomeEl) totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    if (totalExpenseEl) totalExpenseEl.textContent = `$${totalExpense.toFixed(2)}`;
    if (balanceEl) balanceEl.textContent = `$${balance.toFixed(2)}`;
}


// Render chart
function renderChart(transactions) {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    }

    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Destroy previous chart if exists
    if (expenseChart) {
        expenseChart.destroy();
    }

    // Determine text color based on dark mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? 'rgb(224, 224, 224)' : '#333333';

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: ['#4caf50', '#f44336'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        color: textColor
                    }
                }
            }
        }
    });
}

// Add transaction
if (transactionForm) {
    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const { userId, token } = getUserFromStorage();

        const transactionData = {
            userId: Number.parseInt(userId, 10),
            amount: Number.parseFloat(document.getElementById('amount').value),
            date: document.getElementById('date').value,
            category: document.getElementById('category').value,
            type: document.getElementById('type').value,
            description: document.getElementById('description').value || null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Transactions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                alert('Transaction added successfully!');
                transactionForm.reset();
                // Set today's date as default again
                const dateInput = document.getElementById('date');
                if (dateInput) dateInput.valueAsDate = new Date();
                await loadTransactions();
            } else {
                alert('Failed to add transaction. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

// Delete transaction
async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    const { token } = getUserFromStorage();

    try {
        const response = await fetch(`${API_BASE_URL}/Transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Transaction deleted successfully!');
            await loadTransactions();
        } else {
            alert('Failed to delete transaction. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Logout function - with null check
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Clear both localStorage and sessionStorage to be safe
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');

        // Destroy chart
        if (expenseChart) {
            expenseChart.destroy();
            expenseChart = null;
        }

        // Clear global transactions
        allTransactions = [];

        // Close settings modal
        if (settingsModal) settingsModal.style.display = 'none';

        // Hide dashboard and show auth section
        if (dashboard) dashboard.style.display = 'none';
        if (authSection) authSection.style.display = 'flex';

        alert('Logged out successfully!');
    });
}

// Check if user is already logged in and apply theme
globalThis.addEventListener('DOMContentLoaded', async () => {
    // Apply saved theme first
    applySavedTheme();

    const { token, userId, username } = getUserFromStorage();

    if (token && userId) {
        if (authSection) authSection.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        if (usernameDisplay) usernameDisplay.textContent = username;
        
        // Set today's date as default
        const dateInput = document.getElementById('date');
        if (dateInput) dateInput.valueAsDate = new Date();
        
        await loadTransactions();
    }
});