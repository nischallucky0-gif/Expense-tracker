/**
 * SpendFlow - Dashboard Module
 * Handles summary figures, recent transactions, and Chart.js visualizations
 */

const DashboardModule = {
    trendChartInstance: null,
    doughnutChartInstance: null,

    init() {
        const viewAllExpensesBtn = document.getElementById('viewAllExpensesBtn');
        if (viewAllExpensesBtn) {
            viewAllExpensesBtn.addEventListener('click', () => {
                App.switchTab('expenses');
            });
        }
    },

    async loadData(year, month) {
        try {
            const response = await App.apiFetch(`/api/dashboard/summary?year=${year}&month=${month}`);
            if (response && response.data) {
                this.renderDashboard(response.data);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            App.showToast('Failed to load dashboard data: ' + error.message, 'error');
        }
    },

    renderDashboard(data) {
        // 1. Render KPIs
        const balanceEl = document.getElementById('dashTotalBalance');
        const incomeEl = document.getElementById('dashTotalIncome');
        const expenseEl = document.getElementById('dashTotalExpenses');
        const balanceSubtext = document.getElementById('dashBalanceSubtext');

        if (balanceEl) {
            const bal = parseFloat(data.totalBalance) || 0;
            balanceEl.textContent = App.formatCurrency(bal);
            if (bal < 0) {
                balanceEl.classList.add('text-rose');
                balanceEl.classList.remove('text-emerald');
                if (balanceSubtext) balanceSubtext.textContent = 'Expenses exceed income this month';
            } else {
                balanceEl.classList.remove('text-rose');
                balanceEl.classList.add('text-emerald');
                if (balanceSubtext) balanceSubtext.textContent = 'Positive net savings this month';
            }
        }

        if (incomeEl) incomeEl.textContent = App.formatCurrency(data.totalIncome);
        if (expenseEl) expenseEl.textContent = App.formatCurrency(data.totalExpenses);

        // 2. Render Budget Mini Progress
        this.renderBudgetCard(data);

        // 3. Render Top Category Insight
        const topCatEl = document.getElementById('dashTopCategory');
        if (topCatEl) {
            if (data.highestCategoryName && data.highestCategoryName !== 'None') {
                topCatEl.textContent = `${data.highestCategoryName} (${App.formatCurrency(data.highestCategoryAmount)})`;
            } else {
                topCatEl.textContent = 'No expenses recorded for this month';
            }
        }

        // 4. Render Charts
        this.renderTrendChart(data.monthlyTrends || []);
        this.renderCategoryDoughnut(data.categoryBreakdown || []);

        // 5. Render Recent Transactions
        this.renderRecentTransactions(data.recentTransactions || []);
    },

    renderBudgetCard(data) {
        const remainingEl = document.getElementById('dashRemainingBudget');
        const pillEl = document.getElementById('dashBudgetPill');
        const barEl = document.getElementById('dashBudgetBar');
        const spentLabel = document.getElementById('dashBudgetSpentLabel');
        const totalLabel = document.getElementById('dashBudgetTotalLabel');

        const budgetLimit = parseFloat(data.monthlyBudget) || 0;
        const totalSpent = parseFloat(data.totalExpenses) || 0;
        const remaining = parseFloat(data.remainingBudget) || 0;
        const pct = data.budgetUsedPercentage || 0;

        if (remainingEl) remainingEl.textContent = App.formatCurrency(remaining);
        if (spentLabel) spentLabel.textContent = `${App.formatCurrency(totalSpent)} spent`;
        if (totalLabel) totalLabel.textContent = `of ${App.formatCurrency(budgetLimit)}`;

        if (!barEl || !pillEl) return;

        barEl.className = 'progress-bar-fill';

        if (budgetLimit <= 0) {
            pillEl.className = 'badge';
            pillEl.textContent = 'No Limit Set';
            barEl.style.width = '0%';
        } else if (data.budgetExceeded) {
            pillEl.className = 'badge badge-expense';
            pillEl.textContent = `Exceeded (${pct}%)`;
            barEl.classList.add('exceeded');
            barEl.style.width = '100%';
        } else if (data.budgetWarning) {
            pillEl.className = 'badge';
            pillEl.style.backgroundColor = '#fef3c7';
            pillEl.style.color = '#d97706';
            pillEl.textContent = `Warning (${pct}%)`;
            barEl.classList.add('warning');
            barEl.style.width = `${Math.min(pct, 100)}%`;
        } else {
            pillEl.className = 'badge badge-income';
            pillEl.textContent = `On Track (${pct}%)`;
            barEl.style.width = `${Math.min(pct, 100)}%`;
        }
    },

    renderTrendChart(trends) {
        const canvas = document.getElementById('monthlyTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.trendChartInstance) {
            this.trendChartInstance.destroy();
        }

        const labels = trends.map(t => t.monthLabel);
        const incomeData = trends.map(t => parseFloat(t.income) || 0);
        const expenseData = trends.map(t => parseFloat(t.expense) || 0);

        this.trendChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: '#10b981',
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.6,
                        categoryPercentage: 0.7
                    },
                    {
                        label: 'Expense',
                        data: expenseData,
                        backgroundColor: '#f43f5e',
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.6,
                        categoryPercentage: 0.7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        ticks: {
                            font: { family: 'JetBrains Mono', size: 11 },
                            callback: function(value) { return '₹' + value.toLocaleString('en-IN'); }
                        }
                    }
                }
            }
        });
    },

    renderCategoryDoughnut(breakdown) {
        const canvas = document.getElementById('categoryDoughnutChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.doughnutChartInstance) {
            this.doughnutChartInstance.destroy();
        }

        if (!breakdown || breakdown.length === 0) {
            // Render placeholder empty chart or text
            this.doughnutChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['No Expenses'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#e2e8f0']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                }
            });
            return;
        }

        const labels = breakdown.map(b => b.category);
        const data = breakdown.map(b => parseFloat(b.amount) || 0);

        const palette = [
            '#6366f1', '#ec4899', '#8b5cf6', '#3b82f6',
            '#10b981', '#f59e0b', '#06b6d4', '#f43f5e',
            '#14b8a6', '#64748b'
        ];

        this.doughnutChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: palette.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw || 0;
                                return ` ${context.label}: ₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderRecentTransactions(transactions) {
        const tbody = document.getElementById('dashRecentTransactionsBody');
        if (!tbody) return;

        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <div class="empty-state">
                            <i class="fa-solid fa-receipt"></i>
                            <h4>No transactions yet</h4>
                            <p>Click "+ Expense" or "+ Income" to record your first entry.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = transactions.map(item => {
            const isIncome = item.type === 'INCOME';
            const badgeClass = isIncome ? 'badge-income' : 'badge-expense';
            const icon = isIncome ? 'fa-arrow-down-left' : 'fa-arrow-up-right';
            const amountClass = isIncome ? 'text-emerald' : 'text-rose';
            const sign = isIncome ? '+' : '-';

            return `
                <tr>
                    <td>
                        <span class="badge ${badgeClass}">
                            <i class="fa-solid ${icon}"></i> ${item.type}
                        </span>
                    </td>
                    <td><strong>${App.escapeHtml(item.description)}</strong></td>
                    <td><span class="category-tag">${App.escapeHtml(item.category)}</span></td>
                    <td>${App.formatDate(item.transactionDate)}</td>
                    <td><span class="payment-tag"><i class="fa-regular fa-credit-card"></i> ${App.escapeHtml(item.paymentMethod)}</span></td>
                    <td class="text-right font-mono ${amountClass}">
                        <strong>${sign}${App.formatCurrency(item.amount)}</strong>
                    </td>
                </tr>
            `;
        }).join('');
    }
};
