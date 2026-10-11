/**
 * SpendFlow - Budget & Goals Management Module
 * Calculates overall and category budgets with 80% warning and exceeded alerts
 */

const BudgetsModule = {
    budgetsList: [],

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        const openAddBtn = document.getElementById('openAddBudgetModalBtn');
        if (openAddBtn) {
            openAddBtn.addEventListener('click', () => this.openCreateModal());
        }

        const form = document.getElementById('budgetForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const closeBtn = document.getElementById('closeBudgetModalBtn');
        const cancelBtn = document.getElementById('cancelBudgetBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => App.closeModal('budgetModal'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => App.closeModal('budgetModal'));
    },

    async loadData(year, month) {
        try {
            const res = await App.apiFetch(`/api/budgets?year=${year}&month=${month}`);
            if (res && res.data) {
                this.budgetsList = res.data;
                this.renderBudgets(res.data, year, month);
            }
        } catch (error) {
            console.error('Failed to load budgets:', error);
            App.showToast('Failed to load budgets: ' + error.message, 'error');
        }
    },

    renderBudgets(budgets, year, month) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = monthNames[month - 1];

        // 1. Separate Overall Budget vs Category Budgets
        const overall = budgets.find(b => b.category === 'OVERALL');
        const categoryBudgets = budgets.filter(b => b.category !== 'OVERALL');

        // Render Overall Budget Card
        const titleEl = document.getElementById('overallBudgetTitle');
        const limitEl = document.getElementById('overallBudgetLimit');
        const spentEl = document.getElementById('overallBudgetSpent');
        const remEl = document.getElementById('overallBudgetRemaining');
        const pctEl = document.getElementById('overallBudgetPct');
        const fillEl = document.getElementById('overallBudgetProgressFill');
        const badgeEl = document.getElementById('overallBudgetBadge');

        if (titleEl) titleEl.textContent = `${monthName} ${year} Overall Target`;

        if (overall) {
            const limit = parseFloat(overall.amount) || 0;
            const spent = parseFloat(overall.spentAmount) || 0;
            const remaining = parseFloat(overall.remainingAmount) || 0;
            const pct = overall.percentageUsed || 0;

            if (limitEl) limitEl.textContent = App.formatCurrency(limit);
            if (spentEl) spentEl.textContent = App.formatCurrency(spent);
            if (remEl) remEl.textContent = App.formatCurrency(remaining);
            if (pctEl) pctEl.textContent = `${pct}%`;

            if (fillEl) {
                fillEl.style.width = `${Math.min(pct, 100)}%`;
                fillEl.className = 'budget-progress-fill';
                if (overall.exceeded) fillEl.classList.add('exceeded');
                else if (overall.warning) fillEl.classList.add('warning');
            }

            if (badgeEl) {
                if (overall.exceeded) {
                    badgeEl.innerHTML = `<span class="status-pill status-exceeded"><i class="fa-solid fa-circle-exclamation"></i> Exceeded (${pct}%)</span>`;
                } else if (overall.warning) {
                    badgeEl.innerHTML = `<span class="status-pill status-warning"><i class="fa-solid fa-triangle-exclamation"></i> Warning: 80%+ Used</span>`;
                } else {
                    badgeEl.innerHTML = `<span class="status-pill status-healthy"><i class="fa-solid fa-circle-check"></i> On Track</span>`;
                }
            }
        } else {
            if (limitEl) limitEl.textContent = '₹0.00';
            if (spentEl) spentEl.textContent = '₹0.00';
            if (remEl) remEl.textContent = '₹0.00';
            if (pctEl) pctEl.textContent = '0%';
            if (fillEl) fillEl.style.width = '0%';
            if (badgeEl) {
                badgeEl.innerHTML = `<button class="btn btn-sm btn-outline" onclick="BudgetsModule.openCreateModal('OVERALL')"><i class="fa-solid fa-plus"></i> Set Overall Budget</button>`;
            }
        }

        // 2. Render Category Budgets Grid
        const container = document.getElementById('categoryBudgetsContainer');
        const countEl = document.getElementById('categoryBudgetsCount');

        if (countEl) countEl.textContent = `${categoryBudgets.length} categories configured`;
        if (!container) return;

        if (categoryBudgets.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-bullseye"></i>
                    <h4>No category budgets yet</h4>
                    <p>Set category budgets for Food, Transportation, Shopping etc. to keep your spending controlled.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = categoryBudgets.map(b => {
            const limit = parseFloat(b.amount) || 0;
            const spent = parseFloat(b.spentAmount) || 0;
            const remaining = parseFloat(b.remainingAmount) || 0;
            const pct = b.percentageUsed || 0;

            let statusClass = 'status-healthy';
            let statusText = 'On Track';
            let barClass = '';

            if (b.exceeded) {
                statusClass = 'status-exceeded';
                statusText = 'Exceeded!';
                barClass = 'exceeded';
            } else if (b.warning) {
                statusClass = 'status-warning';
                statusText = 'Near Limit (80%+)';
                barClass = 'warning';
            }

            return `
                <div class="cat-budget-card">
                    <div class="cat-budget-top">
                        <span class="category-tag"><i class="fa-solid fa-tag"></i> ${App.escapeHtml(b.category)}</span>
                        <span class="status-pill ${statusClass}">${statusText}</span>
                    </div>

                    <div class="cat-budget-stat-row">
                        <div>
                            <small class="text-muted">Spent:</small>
                            <span class="font-mono text-rose"><strong>${App.formatCurrency(spent)}</strong></span>
                        </div>
                        <div class="text-right">
                            <small class="text-muted">Cap:</small>
                            <span class="font-mono"><strong>${App.formatCurrency(limit)}</strong></span>
                        </div>
                    </div>

                    <div class="budget-mini-progress">
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill ${barClass}" style="width: ${Math.min(pct, 100)}%"></div>
                        </div>
                        <div class="budget-mini-labels">
                            <span>${pct}% used</span>
                            <span>${App.formatCurrency(remaining)} left</span>
                        </div>
                    </div>

                    <div class="cat-budget-actions">
                        <button class="btn-icon-action edit" onclick="BudgetsModule.openEditModal(${b.id})" title="Edit Budget">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon-action delete" onclick="BudgetsModule.confirmDelete(${b.id})" title="Delete Budget">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    openCreateModal(preselectedCategory = 'OVERALL') {
        const titleEl = document.getElementById('budgetModalTitle');
        const form = document.getElementById('budgetForm');
        if (titleEl) titleEl.textContent = 'Set Monthly Budget Limit';
        if (form) form.reset();

        document.getElementById('budgetId').value = '';
        document.getElementById('budgetYear').value = String(App.state.selectedYear);
        document.getElementById('budgetMonth').value = String(App.state.selectedMonth);
        document.getElementById('budgetCategory').value = preselectedCategory;

        App.openModal('budgetModal');
    },

    async openEditModal(id) {
        try {
            const res = await App.apiFetch(`/api/budgets/${id}`);
            if (res && res.data) {
                const b = res.data;
                const titleEl = document.getElementById('budgetModalTitle');
                if (titleEl) titleEl.textContent = 'Edit Budget Limit';

                document.getElementById('budgetId').value = b.id;
                document.getElementById('budgetYear').value = String(b.year);
                document.getElementById('budgetMonth').value = String(b.month);
                document.getElementById('budgetCategory').value = b.category;
                document.getElementById('budgetAmount').value = b.amount;

                App.openModal('budgetModal');
            }
        } catch (error) {
            App.showToast('Failed to retrieve budget: ' + error.message, 'error');
        }
    },

    async handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('saveBudgetBtn');
        if (submitBtn) submitBtn.disabled = true;

        const id = document.getElementById('budgetId').value;
        const payload = {
            year: parseInt(document.getElementById('budgetYear').value, 10),
            month: parseInt(document.getElementById('budgetMonth').value, 10),
            category: document.getElementById('budgetCategory').value,
            amount: parseFloat(document.getElementById('budgetAmount').value)
        };

        try {
            if (id) {
                await App.apiFetch(`/api/budgets/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                App.showToast('Budget updated successfully!', 'success');
            } else {
                await App.apiFetch('/api/budgets', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                App.showToast('Budget set successfully!', 'success');
            }

            App.closeModal('budgetModal');
            this.loadData(App.state.selectedYear, App.state.selectedMonth);

            if (App.state.currentTab === 'dashboard') {
                DashboardModule.loadData(App.state.selectedYear, App.state.selectedMonth);
            }
        } catch (error) {
            App.showToast(error.message, 'error');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    confirmDelete(id) {
        App.showConfirm(
            'Delete Budget Target',
            'Are you sure you want to remove this budget target? Past expenses will not be deleted.',
            async () => {
                try {
                    await App.apiFetch(`/api/budgets/${id}`, { method: 'DELETE' });
                    App.showToast('Budget deleted successfully', 'success');
                    this.loadData(App.state.selectedYear, App.state.selectedMonth);
                    if (App.state.currentTab === 'dashboard') {
                        DashboardModule.loadData(App.state.selectedYear, App.state.selectedMonth);
                    }
                } catch (error) {
                    App.showToast('Failed to delete budget: ' + error.message, 'error');
                }
            }
        );
    }
};
