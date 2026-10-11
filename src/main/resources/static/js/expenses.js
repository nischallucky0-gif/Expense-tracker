/**
 * SpendFlow - Expense Management Module
 * Full CRUD, search, filter, sort, pagination, and confirmation handling
 */

const ExpensesModule = {
    state: {
        page: 0,
        size: 10,
        totalPages: 1,
        totalElements: 0,
        category: '',
        startDate: '',
        endDate: '',
        search: '',
        sortBy: 'transactionDate',
        direction: 'desc'
    },

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Open Modal Button
        const openAddBtn = document.getElementById('openAddExpenseModalBtn');
        if (openAddBtn) {
            openAddBtn.addEventListener('click', () => this.openCreateModal());
        }

        // Form Submit
        const form = document.getElementById('expenseForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Modal Cancel / Close
        const closeBtn = document.getElementById('closeExpenseModalBtn');
        const cancelBtn = document.getElementById('cancelExpenseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => App.closeModal('expenseModal'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => App.closeModal('expenseModal'));

        // Search Input (with debounce)
        const searchInput = document.getElementById('expenseSearchInput');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.state.search = e.target.value.trim();
                    this.state.page = 0;
                    this.loadData();
                }, 350);
            });
        }

        // Category Filter
        const catFilter = document.getElementById('expenseCategoryFilter');
        if (catFilter) {
            catFilter.addEventListener('change', (e) => {
                this.state.category = e.target.value;
                this.state.page = 0;
                this.loadData();
            });
        }

        // Date Filters
        const startDateInput = document.getElementById('expenseStartDate');
        const endDateInput = document.getElementById('expenseEndDate');
        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                this.state.startDate = e.target.value;
                this.state.page = 0;
                this.loadData();
            });
        }
        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                this.state.endDate = e.target.value;
                this.state.page = 0;
                this.loadData();
            });
        }

        // Sort By Filter
        const sortBySelect = document.getElementById('expenseSortBy');
        if (sortBySelect) {
            sortBySelect.addEventListener('change', (e) => {
                const [sort, dir] = e.target.value.split('-');
                this.state.sortBy = sort;
                this.state.direction = dir;
                this.state.page = 0;
                this.loadData();
            });
        }

        // Reset Filters Button
        const resetBtn = document.getElementById('resetExpenseFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        // Pagination Controls
        const prevBtn = document.getElementById('expensePrevPageBtn');
        const nextBtn = document.getElementById('expenseNextPageBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.state.page > 0) {
                    this.state.page--;
                    this.loadData();
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.state.page < this.state.totalPages - 1) {
                    this.state.page++;
                    this.loadData();
                }
            });
        }
    },

    resetFilters() {
        this.state.page = 0;
        this.state.category = '';
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.search = '';
        this.state.sortBy = 'transactionDate';
        this.state.direction = 'desc';

        const searchInput = document.getElementById('expenseSearchInput');
        const catFilter = document.getElementById('expenseCategoryFilter');
        const startDateInput = document.getElementById('expenseStartDate');
        const endDateInput = document.getElementById('expenseEndDate');
        const sortBySelect = document.getElementById('expenseSortBy');

        if (searchInput) searchInput.value = '';
        if (catFilter) catFilter.value = '';
        if (startDateInput) startDateInput.value = '';
        if (endDateInput) endDateInput.value = '';
        if (sortBySelect) sortBySelect.value = 'transactionDate-desc';

        this.loadData();
    },

    async loadData() {
        const tbody = document.getElementById('expensesTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="loading-spinner"></div>
                        <span class="text-muted">Loading expenses...</span>
                    </td>
                </tr>
            `;
        }

        try {
            const params = new URLSearchParams({
                page: this.state.page,
                size: this.state.size,
                sortBy: this.state.sortBy,
                direction: this.state.direction
            });

            if (this.state.category) params.append('category', this.state.category);
            if (this.state.startDate) params.append('startDate', this.state.startDate);
            if (this.state.endDate) params.append('endDate', this.state.endDate);
            if (this.state.search) params.append('search', this.state.search);

            const res = await App.apiFetch(`/api/expenses?${params.toString()}`);
            if (res && res.data) {
                const pageData = res.data;
                this.state.totalPages = pageData.totalPages;
                this.state.totalElements = pageData.totalElements;

                // Update badge in sidebar
                const badge = document.getElementById('navExpenseCount');
                if (badge) badge.textContent = pageData.totalElements;

                this.renderTable(pageData.content || []);
                this.renderPagination(pageData);
            }
        } catch (error) {
            console.error('Failed to load expenses:', error);
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4 text-danger">
                            Failed to load expenses: ${App.escapeHtml(error.message)}
                        </td>
                    </tr>
                `;
            }
        }
    },

    renderTable(expenses) {
        const tbody = document.getElementById('expensesTableBody');
        if (!tbody) return;

        if (expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="empty-state">
                            <i class="fa-solid fa-receipt"></i>
                            <h4>No expenses found</h4>
                            <p>Try adjusting your search criteria or add a new expense.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = expenses.map(item => `
            <tr>
                <td>${App.formatDate(item.transactionDate)}</td>
                <td><strong>${App.escapeHtml(item.description)}</strong></td>
                <td><span class="category-tag">${App.escapeHtml(item.category)}</span></td>
                <td><span class="payment-tag"><i class="fa-regular fa-credit-card"></i> ${App.escapeHtml(item.paymentMethod)}</span></td>
                <td><small class="text-muted">${item.notes ? App.escapeHtml(item.notes) : '-'}</small></td>
                <td class="text-right font-mono text-rose"><strong>-${App.formatCurrency(item.amount)}</strong></td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-icon-action edit" onclick="ExpensesModule.openEditModal(${item.id})" title="Edit Expense">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon-action delete" onclick="ExpensesModule.confirmDelete(${item.id})" title="Delete Expense">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderPagination(pageData) {
        const infoEl = document.getElementById('expensePaginationInfo');
        const pageEl = document.getElementById('expenseCurrentPage');
        const prevBtn = document.getElementById('expensePrevPageBtn');
        const nextBtn = document.getElementById('expenseNextPageBtn');

        const start = pageData.totalElements === 0 ? 0 : (pageData.number * pageData.size) + 1;
        const end = Math.min((pageData.number + 1) * pageData.size, pageData.totalElements);

        if (infoEl) infoEl.textContent = `Showing ${start} to ${end} of ${pageData.totalElements} expenses`;
        if (pageEl) pageEl.textContent = `Page ${pageData.totalPages === 0 ? 0 : pageData.number + 1} of ${pageData.totalPages}`;

        if (prevBtn) prevBtn.disabled = pageData.first;
        if (nextBtn) nextBtn.disabled = pageData.last;
    },

    openCreateModal() {
        const titleEl = document.getElementById('expenseModalTitle');
        const form = document.getElementById('expenseForm');
        if (titleEl) titleEl.textContent = 'Add New Expense';
        if (form) form.reset();

        document.getElementById('expenseId').value = '';
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

        App.openModal('expenseModal');
    },

    async openEditModal(id) {
        try {
            const res = await App.apiFetch(`/api/expenses/${id}`);
            if (res && res.data) {
                const exp = res.data;
                const titleEl = document.getElementById('expenseModalTitle');
                if (titleEl) titleEl.textContent = 'Edit Expense';

                document.getElementById('expenseId').value = exp.id;
                document.getElementById('expenseAmount').value = exp.amount;
                document.getElementById('expenseCategory').value = exp.category;
                document.getElementById('expenseDescription').value = exp.description;
                document.getElementById('expenseDate').value = exp.transactionDate;
                document.getElementById('expensePaymentMethod').value = exp.paymentMethod;
                document.getElementById('expenseNotes').value = exp.notes || '';

                App.openModal('expenseModal');
            }
        } catch (error) {
            App.showToast('Failed to retrieve expense: ' + error.message, 'error');
        }
    },

    async handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('saveExpenseBtn');
        if (submitBtn) submitBtn.disabled = true;

        const id = document.getElementById('expenseId').value;
        const payload = {
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            description: document.getElementById('expenseDescription').value.trim(),
            transactionDate: document.getElementById('expenseDate').value,
            paymentMethod: document.getElementById('expensePaymentMethod').value,
            notes: document.getElementById('expenseNotes').value.trim() || null
        };

        try {
            if (id) {
                // Update
                await App.apiFetch(`/api/expenses/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                App.showToast('Expense updated successfully!', 'success');
            } else {
                // Create
                await App.apiFetch('/api/expenses', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                App.showToast('Expense added successfully!', 'success');
            }

            App.closeModal('expenseModal');
            this.loadData();

            // Refresh Dashboard if open
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
            'Delete Expense',
            'Are you sure you want to permanently delete this expense? This action cannot be undone.',
            async () => {
                try {
                    await App.apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
                    App.showToast('Expense deleted successfully', 'success');
                    this.loadData();
                    if (App.state.currentTab === 'dashboard') {
                        DashboardModule.loadData(App.state.selectedYear, App.state.selectedMonth);
                    }
                } catch (error) {
                    App.showToast('Failed to delete expense: ' + error.message, 'error');
                }
            }
        );
    }
};
