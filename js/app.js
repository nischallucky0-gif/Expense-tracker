/**
 * SpendFlow - Core Application Logic & Router
 */

const App = {
    state: {
        currentTab: 'dashboard',
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth() + 1,
        expenseCount: 0,
        incomeCount: 0,
        backendConnected: false,
        customApiBase: localStorage.getItem('spendflow_backend_url') || ''
    },

    async init() {
        if (window.MockStore) {
            window.MockStore.init();
        }

        this.setupNavigation();
        this.setupDateSelectors();
        this.setupModals();
        this.setupBackendSettings();

        // Check backend health before rendering view
        await this.checkBackendHealth();

        // Listen for quick action buttons
        const quickAddExpense = document.getElementById('quickAddExpenseBtn');
        if (quickAddExpense) {
            quickAddExpense.addEventListener('click', () => ExpensesModule.openCreateModal());
        }

        const quickAddIncome = document.getElementById('quickAddIncomeBtn');
        if (quickAddIncome) {
            quickAddIncome.addEventListener('click', () => IncomeModule.openCreateModal());
        }

        const manageBudgetShortcut = document.getElementById('manageBudgetShortcutBtn');
        if (manageBudgetShortcut) {
            manageBudgetShortcut.addEventListener('click', () => this.switchTab('budgets'));
        }

        // Initialize active modules
        DashboardModule.init();
        ExpensesModule.init();
        IncomeModule.init();
        BudgetsModule.init();
        ReportsModule.init();

        // Initial load of dashboard
        this.loadCurrentView();
    },

    setupNavigation() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Mobile drawer toggles
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');

        if (menuToggleBtn && sidebar && backdrop) {
            menuToggleBtn.addEventListener('click', () => {
                sidebar.classList.add('mobile-open');
                backdrop.classList.add('active');
            });
        }

        const closeSidebar = () => {
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (backdrop) backdrop.classList.remove('active');
        };

        if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeSidebar);
        if (backdrop) backdrop.addEventListener('click', closeSidebar);
    },

    setupDateSelectors() {
        const monthSelect = document.getElementById('globalMonthSelect');
        const yearSelect = document.getElementById('globalYearSelect');

        if (monthSelect) {
            monthSelect.value = String(this.state.selectedMonth);
            monthSelect.addEventListener('change', (e) => {
                this.state.selectedMonth = parseInt(e.target.value, 10);
                this.loadCurrentView();
            });
        }

        if (yearSelect) {
            yearSelect.value = String(this.state.selectedYear);
            yearSelect.addEventListener('change', (e) => {
                this.state.selectedYear = parseInt(e.target.value, 10);
                this.loadCurrentView();
            });
        }
    },

    switchTab(tabId) {
        this.state.currentTab = tabId;

        // Update nav UI
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Views
        document.querySelectorAll('.view-section').forEach(view => {
            view.classList.remove('active');
        });

        const activeView = document.getElementById(`view-${tabId}`);
        if (activeView) activeView.classList.add('active');

        // Update Topbar Title
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        switch (tabId) {
            case 'dashboard':
                if (pageTitle) pageTitle.textContent = 'Financial Dashboard';
                if (pageSubtitle) pageSubtitle.textContent = 'Real-time overview of cash flow, budget limits, and spending trends';
                break;
            case 'expenses':
                if (pageTitle) pageTitle.textContent = 'Expense Management';
                if (pageSubtitle) pageSubtitle.textContent = 'Filter, search, track and categorize all your spending';
                break;
            case 'income':
                if (pageTitle) pageTitle.textContent = 'Income Management';
                if (pageSubtitle) pageSubtitle.textContent = 'Record earnings, salaries, dividends, and business profits';
                break;
            case 'budgets':
                if (pageTitle) pageTitle.textContent = 'Budgets & Financial Goals';
                if (pageSubtitle) pageSubtitle.textContent = 'Set spending caps and receive visual threshold warnings';
                break;
            case 'reports':
                if (pageTitle) pageTitle.textContent = 'Analytics & Reports';
                if (pageSubtitle) pageSubtitle.textContent = 'Comprehensive breakdown and multi-period savings analysis';
                break;
        }

        // Close mobile drawer if open
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');

        this.loadCurrentView();
    },

    loadCurrentView() {
        switch (this.state.currentTab) {
            case 'dashboard':
                DashboardModule.loadData(this.state.selectedYear, this.state.selectedMonth);
                break;
            case 'expenses':
                ExpensesModule.loadData();
                break;
            case 'income':
                IncomeModule.loadData();
                break;
            case 'budgets':
                BudgetsModule.loadData(this.state.selectedYear, this.state.selectedMonth);
                break;
            case 'reports':
                ReportsModule.loadData();
                break;
        }
    },

    // ===================================================================
    // API & Network Helper
    // ===================================================================
    getApiUrl(path) {
        if (this.state.customApiBase && this.state.customApiBase.trim()) {
            const base = this.state.customApiBase.trim().replace(/\/+$/, '');
            return `${base}${path}`;
        }
        return path;
    },

    async apiFetch(url, options = {}) {
        if (this.state.backendConnected) {
            try {
                const fullUrl = this.getApiUrl(url);
                const defaultHeaders = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };
                const config = {
                    ...options,
                    headers: {
                        ...defaultHeaders,
                        ...(options.headers || {})
                    }
                };

                const response = await fetch(fullUrl, config);
                const json = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const message = json.message || json.error || `Request failed with status ${response.status}`;
                    throw new Error(message);
                }

                return json;
            } catch (error) {
                console.warn('Backend request failed, falling back to MockStore:', error);
                if (window.MockStore) {
                    return await window.MockStore.handleRequest(url, options);
                }
                throw error;
            }
        } else {
            // Cloud Demo / Local Storage Mode (active on Vercel or offline)
            if (window.MockStore) {
                return await window.MockStore.handleRequest(url, options);
            }
            throw new Error('Backend offline and MockStore unavailable');
        }
    },

    async checkBackendHealth() {
        const statusText = document.getElementById('backendStatusText');
        const statusPill = document.getElementById('backendStatusPill');
        const techText = document.getElementById('backendTechText');

        try {
            const testUrl = this.getApiUrl('/api/expenses/categories');
            const res = await fetch(testUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const json = await res.json().catch(() => null);
                if (json && json.success) {
                    this.state.backendConnected = true;
                    if (statusText) statusText.textContent = 'Backend: Online';
                    if (statusPill) {
                        statusPill.classList.remove('status-demo');
                        statusPill.classList.add('status-online');
                    }
                    if (techText) techText.innerHTML = 'Spring Boot &bull; MySQL';
                    return true;
                }
            }
            throw new Error('Backend not available');
        } catch (e) {
            this.state.backendConnected = false;
            if (statusText) statusText.textContent = 'Cloud Demo Mode';
            if (statusPill) {
                statusPill.classList.remove('status-online');
                statusPill.classList.add('status-demo');
            }
            if (techText) techText.innerHTML = 'Interactive Local Storage';
            return false;
        }
    },

    setupBackendSettings() {
        const statusPill = document.getElementById('backendStatusPill');
        if (statusPill) {
            statusPill.addEventListener('click', () => this.openBackendSettingsModal());
        }

        const form = document.getElementById('backendSettingsForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = document.getElementById('backendUrlInput');
                const val = input ? input.value.trim() : '';
                this.state.customApiBase = val;
                if (val) {
                    localStorage.setItem('spendflow_backend_url', val);
                } else {
                    localStorage.removeItem('spendflow_backend_url');
                }
                this.closeModal('backendSettingsModal');
                this.showToast('Rechecking backend connection...', 'info');
                await this.checkBackendHealth();
                this.loadCurrentView();
            });
        }

        const resetDataBtn = document.getElementById('resetSampleDataBtn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                if (window.MockStore) {
                    window.MockStore.resetAllData();
                    this.closeModal('backendSettingsModal');
                    this.showToast('Sample data reset successfully!', 'success');
                    this.loadCurrentView();
                }
            });
        }
    },

    openBackendSettingsModal() {
        const input = document.getElementById('backendUrlInput');
        if (input) input.value = this.state.customApiBase || '';

        const modeBadge = document.getElementById('currentModeBadge');
        if (modeBadge) {
            if (this.state.backendConnected) {
                modeBadge.textContent = 'Spring Boot Live API (Connected)';
                modeBadge.className = 'badge badge-success';
            } else {
                modeBadge.textContent = 'Interactive Cloud Demo (LocalStorage)';
                modeBadge.className = 'badge badge-warning';
            }
        }
        this.openModal('backendSettingsModal');
    },

    // ===================================================================
    // Modal Helpers
    // ===================================================================
    setupModals() {
        // Close on clicking backdrop
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal(overlay.id);
                }
            });
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
                    this.closeModal(overlay.id);
                });
            }
        });
    },

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    showConfirm(title, message, onConfirm) {
        const titleEl = document.getElementById('confirmModalTitle');
        const msgEl = document.getElementById('confirmModalMessage');
        const okBtn = document.getElementById('confirmOkBtn');
        const cancelBtn = document.getElementById('confirmCancelBtn');
        const closeBtn = document.getElementById('closeConfirmModalBtn');

        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;

        const cleanup = () => {
            this.closeModal('confirmModal');
            okBtn.replaceWith(okBtn.cloneNode(true));
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
            closeBtn.replaceWith(closeBtn.cloneNode(true));
        };

        this.openModal('confirmModal');

        const freshOkBtn = document.getElementById('confirmOkBtn');
        const freshCancelBtn = document.getElementById('confirmCancelBtn');
        const freshCloseBtn = document.getElementById('closeConfirmModalBtn');

        freshOkBtn.onclick = () => {
            cleanup();
            if (typeof onConfirm === 'function') onConfirm();
        };

        freshCancelBtn.onclick = cleanup;
        freshCloseBtn.onclick = cleanup;
    },

    // ===================================================================
    // Toast Notifications
    // ===================================================================
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-exclamation';
        if (type === 'warning') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon} toast-icon"></i>
            <span>${this.escapeHtml(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // ===================================================================
    // Formatting & Sanitization Helpers
    // ===================================================================
    formatCurrency(val) {
        const num = parseFloat(val) || 0;
        return '₹' + num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    formatDate(dateStr) {
        if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('-')) return '';
        try {
            const [year, month, day] = dateStr.split('-');
            const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            if (isNaN(date.getTime())) return String(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return String(dateStr);
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
