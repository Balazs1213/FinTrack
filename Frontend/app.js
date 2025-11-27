const API_BASE_URL = 'http://localhost:5062/api';

// Get DOM elements
const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const transactionForm = document.getElementById('transaction-form');
const transactionsBody = document.getElementById('transactions-body');
const usernameDisplay = document.getElementById('username-display');
const filterBtn = document.getElementById('filter-btn');
const resetBtn = document.getElementById('reset-btn');

let expenseChart = null;
let allTransactions = []; // Store all transactions globally

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
});

// Login function
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

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
            // Save token and userId to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('username', data.user.username);

            // Show success message
            alert('Login Successful!');

            // Hide auth section and show dashboard
            authSection.style.display = 'none';
            dashboard.style.display = 'block';
            usernameDisplay.textContent = data.user.username;

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

// Register function
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
            registerFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
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

// Filter transactions
function filterTransactions() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const type = document.getElementById('filter-type').value;

    let filtered = [...allTransactions];

    // Validate date range if both dates are provided
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            alert('Error: The start date cannot be greater than the end date!');
            document.getElementById('filter-end-date').value = '';
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
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('filter-type').value = '';
    
    // Show all transactions
    renderTransactions(allTransactions);
    updateSummary(allTransactions);
    renderChart(allTransactions);
}

// Add event listeners for filter buttons
filterBtn.addEventListener('click', filterTransactions);
resetBtn.addEventListener('click', resetFilters);

// Load transactions
async function loadTransactions() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

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

    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expense').textContent = `$${totalExpense.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
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

    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Destroy previous chart if exists
    if (expenseChart) {
        expenseChart.destroy();
    }

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
                        }
                    }
                }
            }
        }
    });
}

// Add transaction
transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

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
            document.getElementById('date').valueAsDate = new Date();
            await loadTransactions();
        } else {
            alert('Failed to add transaction. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

// Delete transaction
async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    const token = localStorage.getItem('token');

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

// Logout function
logoutBtn.addEventListener('click', () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    // Destroy chart
    if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
    }

    // Clear global transactions
    allTransactions = [];

    // Hide dashboard and show auth section
    dashboard.style.display = 'none';
    authSection.style.display = 'flex';

    alert('Logged out successfully!');
});

// Check if user is already logged in
globalThis.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId) {
        authSection.style.display = 'none';
        dashboard.style.display = 'block';
        usernameDisplay.textContent = username;
        
        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();
        
        await loadTransactions();
    }
});