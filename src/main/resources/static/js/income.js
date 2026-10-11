/**
 * SpendFlow - Income Management Module
 * Full CRUD, search, filter, sort, pagination, and confirmation handling
 */

const IncomeModule = {
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
        const openAddBtn = document.getElementById('openAddIncomeModalBtn');
        if (openAddBtn) {
            openAddBtn.addEventListener('click', () => this.openCreateModal());
        }

        // Form Submit
        const form = document.getElementById('incomeForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Modal Cancel / Close
        const closeBtn = document.getElementById('closeIncomeModalBtn');
        const cancelBtn = document.getElementById('cancelIncomeBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => App.closeModal('incomeModal'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => App.closeModal('incomeModal'));

        // Search Input (debounced)
        const searchInput = document.getElementById('incomeSearchInput');
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
        const catFilter = document.getElementById('incomeCategoryFilter');
        if (catFilter) {
            catFilter.addEventListener('change', (e) => {
                this.state.category = e.target.value;
                this.state.page = 0;
                this.loadData();
            });
        }

        // Date Filters
        const startDateInput = document.getElementById('incomeStartDate');
        const endDateInput = document.getElementById('incomeEndDate');
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
        const sortBySelect = document.getElementById('incomeSortBy');
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
        const resetBtn = document.getElementById('resetIncomeFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        // Pagination Controls
        const prevBtn = document.getElementById('incomePrevPageBtn');
        const nextBtn = document.getElementById('incomeNextPageBtn');
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

        const searchInput = document.getElementById('incomeSearchInput');
        const catFilter = document.getElementById('incomeCategoryFilter');
        const startDateInput = document.getElementById('incomeStartDate');
        const endDateInput = document.getElementById('incomeEndDate');
        const sortBySelect = document.getElementById('incomeSortBy');

        if (searchInput) searchInput.value = '';
        if (catFilter) catFilter.value = '';
        if (startDateInput) startDateInput.value = '';
        if (endDateInput) endDateInput.value = '';
        if (sortBySelect) sortBySelect.value = 'transactionDate-desc';

        this.loadData();
    },

    async loadData() {
        const tbody = document.getElementById('incomeTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="loading-spinner"></div>
                        <span class="text-muted">Loading income records...</span>
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

            const res = await App.apiFetch(`/api/income?${params.toString()}`);
            if (res && res.data) {
                const pageData = res.data;
                this.state.totalPages = pageData.totalPages;
                this.state.totalElements = pageData.totalElements;

                // Update badge in sidebar
                const badge = document.getElementById('navIncomeCount');
                if (badge) badge.textContent = pageData.totalElements;

                this.renderTable(pageData.content || []);
                this.renderPagination(pageData);
            }
        } catch (error) {
            console.error('Failed to load income:', error);
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4 text-danger">
                            Failed to load income: ${App.escapeHtml(error.message)}
                        </td>
                    </tr>
                `;
            }
        }
    },

    renderTable(incomeList) {
        const tbody = document.getElementById('incomeTableBody');
        if (!tbody) return;

        if (incomeList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="empty-state">
                            <i class="fa-solid fa-money-bill-wave"></i>
                            <h4>No income records found</h4>
                            <p>Try adjusting your search criteria or add new income.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = incomeList.map(item => `
            <tr>
                <td>${App.formatDate(item.transactionDate)}</td>
                <td><strong>${App.escapeHtml(item.description)}</strong></td>
                <td><span class="category-tag">${App.escapeHtml(item.category)}</span></td>
                <td><span class="payment-tag"><i class="fa-solid fa-building-columns"></i> ${App.escapeHtml(item.paymentMethod)}</span></td>
                <td><small class="text-muted">${item.notes ? App.escapeHtml(item.notes) : '-'}</small></td>
                <td class="text-right font-mono text-emerald"><strong>+${App.formatCurrency(item.amount)}</strong></td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-icon-action edit" onclick="IncomeModule.openEditModal(${item.id})" title="Edit Income">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon-action delete" onclick="IncomeModule.confirmDelete(${item.id})" title="Delete Income">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderPagination(pageData) {
        const infoEl = document.getElementById('incomePaginationInfo');
        const pageEl = document.getElementById('incomeCurrentPage');
        const prevBtn = document.getElementById('incomePrevPageBtn');
        const nextBtn = document.getElementById('incomeNextPageBtn');

        const start = pageData.totalElements === 0 ? 0 : (pageData.number * pageData.size) + 1;
        const end = Math.min((pageData.number + 1) * pageData.size, pageData.totalElements);

        if (infoEl) infoEl.textContent = `Showing ${start} to ${end} of ${pageData.totalElements} records`;
        if (pageEl) pageEl.textContent = `Page ${pageData.totalPages === 0 ? 0 : pageData.number + 1} of ${pageData.totalPages}`;

        if (prevBtn) prevBtn.disabled = pageData.first;
        if (nextBtn) nextBtn.disabled = pageData.last;
    },

    openCreateModal() {
        const titleEl = document.getElementById('incomeModalTitle');
        const form = document.getElementById('incomeForm');
        if (titleEl) titleEl.textContent = 'Add New Income';
        if (form) form.reset();

        document.getElementById('incomeId').value = '';
        document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];

        App.openModal('incomeModal');
    },

    async openEditModal(id) {
        try {
            const res = await App.apiFetch(`/api/income/${id}`);
            if (res && res.data) {
                const inc = res.data;
                const titleEl = document.getElementById('incomeModalTitle');
                if (titleEl) titleEl.textContent = 'Edit Income';

                document.getElementById('incomeId').value = inc.id;
                document.getElementById('incomeAmount').value = inc.amount;
                document.getElementById('incomeCategory').value = inc.category;
                document.getElementById('incomeDescription').value = inc.description;
                document.getElementById('incomeDate').value = inc.transactionDate;
                document.getElementById('incomePaymentMethod').value = inc.paymentMethod;
                document.getElementById('incomeNotes').value = inc.notes || '';

                App.openModal('incomeModal');
            }
        } catch (error) {
            App.showToast('Failed to retrieve income: ' + error.message, 'error');
        }
    },

    async handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('saveIncomeBtn');
        if (submitBtn) submitBtn.disabled = true;

        const id = document.getElementById('incomeId').value;
        const payload = {
            amount: parseFloat(document.getElementById('incomeAmount').value),
            category: document.getElementById('incomeCategory').value,
            description: document.getElementById('incomeDescription').value.trim(),
            transactionDate: document.getElementById('incomeDate').value,
            paymentMethod: document.getElementById('incomePaymentMethod').value,
            notes: document.getElementById('incomeNotes').value.trim() || null
        };

        try {
            if (id) {
                await App.apiFetch(`/api/income/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                App.showToast('Income updated successfully!', 'success');
            } else {
                await App.apiFetch('/api/income', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                App.showToast('Income recorded successfully!', 'success');
            }

            App.closeModal('incomeModal');
            this.loadData();

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
            'Delete Income Record',
            'Are you sure you want to permanently delete this income entry? This will update your net balance.',
            async () => {
                try {
                    await App.apiFetch(`/api/income/${id}`, { method: 'DELETE' });
                    App.showToast('Income deleted successfully', 'success');
                    this.loadData();
                    if (App.state.currentTab === 'dashboard') {
                        DashboardModule.loadData(App.state.selectedYear, App.state.selectedMonth);
                    }
                } catch (error) {
                    App.showToast('Failed to delete income: ' + error.message, 'error');
                }
            }
        );
    }
};
