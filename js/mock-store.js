/**
 * SpendFlow - Mock Storage & Interactive Client-Side Engine
 * Provides persistent in-browser LocalStorage data and API emulation.
 * Ensures complete interactive functionality when running on Vercel or when Spring Boot is offline.
 * Synchronized with the exact live data from http://localhost:8080/
 */

const MockStore = {
    STORAGE_KEY_EXPENSES: 'spendflow_expenses',
    STORAGE_KEY_INCOMES: 'spendflow_incomes',
    STORAGE_KEY_BUDGETS: 'spendflow_budgets',
    STORAGE_KEY_FLAG: 'spendflow_storage_v5',

    EXPENSE_CATEGORIES: [
        'Food', 'Transportation', 'Housing', 'Bills',
        'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Travel', 'Other'
    ],

    INCOME_CATEGORIES: [
        'Salary', 'Freelance', 'Business', 'Investments', 'Other'
    ],

    init() {
        const flag = localStorage.getItem(this.STORAGE_KEY_FLAG);
        const existingExp = localStorage.getItem(this.STORAGE_KEY_EXPENSES);
        if (!flag || !existingExp) {
            this.seedInitialData();
            localStorage.setItem(this.STORAGE_KEY_FLAG, 'true');
        }
    },

    parseDateParts(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') {
            const now = new Date();
            return [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        }
        const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const parts = clean.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        const now = new Date();
        return [
            isNaN(y) ? now.getFullYear() : y,
            isNaN(m) ? (now.getMonth() + 1) : m,
            isNaN(d) ? 1 : d
        ];
    },

    seedInitialData() {
        // Exact dataset from live Spring Boot instance (http://localhost:8080)
        const initialIncomes = [
            {
                id: 3,
                amount: 3500.00,
                category: 'Investments',
                description: 'Quarterly Mutual Fund Dividend',
                transactionDate: '2026-10-12',
                paymentMethod: 'Bank Transfer',
                notes: 'Index fund dividend distribution',
                createdAt: '2026-10-11T15:20:06.043838',
                updatedAt: '2026-10-11T15:20:06.043841'
            },
            {
                id: 8,
                amount: 25000.00,
                category: 'Salary',
                description: 'Half month salary',
                transactionDate: '2026-10-11',
                paymentMethod: 'Bank Transfer',
                notes: '',
                createdAt: '2026-10-11T15:21:20.605737',
                updatedAt: '2026-10-11T15:21:20.605748'
            },
            {
                id: 9,
                amount: 10.00,
                category: 'Salary',
                description: 'Half month salary',
                transactionDate: '2026-10-11',
                paymentMethod: 'Bank Transfer',
                notes: '',
                createdAt: '2026-10-11T15:21:46.465098',
                updatedAt: '2026-10-11T15:21:46.465119'
            },
            {
                id: 10,
                amount: 20.00,
                category: 'Salary',
                description: 'Half month salary',
                transactionDate: '2026-10-11',
                paymentMethod: 'Bank Transfer',
                notes: '',
                createdAt: '2026-10-11T15:21:58.664528',
                updatedAt: '2026-10-11T15:21:58.664546'
            },
            {
                id: 2,
                amount: 15000.00,
                category: 'Freelance',
                description: 'Mobile App UI Design Project',
                transactionDate: '2026-10-08',
                paymentMethod: 'Bank Transfer',
                notes: 'Client invoice #104',
                createdAt: '2026-10-11T15:20:06.043402',
                updatedAt: '2026-10-11T15:20:06.043406'
            },
            {
                id: 1,
                amount: 85000.00,
                category: 'Salary',
                description: 'Monthly Tech Corp Salary',
                transactionDate: '2026-10-01',
                paymentMethod: 'Bank Transfer',
                notes: 'Direct deposit regular payroll',
                createdAt: '2026-10-11T15:20:06.042639',
                updatedAt: '2026-10-11T15:20:06.042643'
            },
            {
                id: 5,
                amount: 20000.00,
                category: 'Freelance',
                description: 'Backend API Consulting',
                transactionDate: '2026-09-15',
                paymentMethod: 'Bank Transfer',
                notes: 'Consulting contract',
                createdAt: '2026-10-11T15:20:06.044729',
                updatedAt: '2026-10-11T15:20:06.044733'
            },
            {
                id: 4,
                amount: 85000.00,
                category: 'Salary',
                description: 'Monthly Tech Corp Salary',
                transactionDate: '2026-09-01',
                paymentMethod: 'Bank Transfer',
                notes: 'Direct deposit regular payroll',
                createdAt: '2026-10-11T15:20:06.044286',
                updatedAt: '2026-10-11T15:20:06.044290'
            },
            {
                id: 7,
                amount: 6000.00,
                category: 'Business',
                description: 'E-commerce Affiliate Income',
                transactionDate: '2026-08-20',
                paymentMethod: 'Bank Transfer',
                notes: 'Monthly affiliate commission',
                createdAt: '2026-10-11T15:20:06.045577',
                updatedAt: '2026-10-11T15:20:06.045581'
            },
            {
                id: 6,
                amount: 80000.00,
                category: 'Salary',
                description: 'Monthly Tech Corp Salary',
                transactionDate: '2026-08-01',
                paymentMethod: 'Bank Transfer',
                notes: 'Direct deposit regular payroll',
                createdAt: '2026-10-11T15:20:06.045155',
                updatedAt: '2026-10-11T15:20:06.045160'
            }
        ];

        const initialExpenses = [
            {
                id: 10,
                amount: 2500.00,
                category: 'Transportation',
                description: 'Fuel & Vehicle Service',
                transactionDate: '2026-10-13',
                paymentMethod: 'UPI',
                notes: 'Fuel station',
                createdAt: '2026-10-11T15:20:06.050584',
                updatedAt: '2026-10-11T15:20:06.050587'
            },
            {
                id: 9,
                amount: 2100.00,
                category: 'Food',
                description: 'Midweek Grocery & Snacks',
                transactionDate: '2026-10-12',
                paymentMethod: 'UPI',
                notes: 'Groceries and fruits',
                createdAt: '2026-10-11T15:20:06.050216',
                updatedAt: '2026-10-11T15:20:06.050219'
            },
            {
                id: 8,
                amount: 999.00,
                category: 'Entertainment',
                description: 'Video & Music Streaming Plans',
                transactionDate: '2026-10-11',
                paymentMethod: 'Credit Card',
                notes: 'Netflix & Spotify subscriptions',
                createdAt: '2026-10-11T15:20:06.049775',
                updatedAt: '2026-10-11T15:20:06.049778'
            },
            {
                id: 7,
                amount: 650.00,
                category: 'Healthcare',
                description: 'Prescription & Vitamins',
                transactionDate: '2026-10-10',
                paymentMethod: 'Cash',
                notes: 'Neighborhood pharmacy',
                createdAt: '2026-10-11T15:20:06.049383',
                updatedAt: '2026-10-11T15:20:06.049387'
            },
            {
                id: 6,
                amount: 1850.00,
                category: 'Food',
                description: 'Dinner with Friends at Restaurant',
                transactionDate: '2026-10-09',
                paymentMethod: 'Credit Card',
                notes: 'Friday team celebration',
                createdAt: '2026-10-11T15:20:06.048872',
                updatedAt: '2026-10-11T15:20:06.048876'
            },
            {
                id: 5,
                amount: 2499.00,
                category: 'Shopping',
                description: 'Ergonomic Desk Accessories',
                transactionDate: '2026-10-07',
                paymentMethod: 'Credit Card',
                notes: 'Wireless keyboard & wrist rest',
                createdAt: '2026-10-11T15:20:06.048497',
                updatedAt: '2026-10-11T15:20:06.048500'
            },
            {
                id: 4,
                amount: 1200.00,
                category: 'Transportation',
                description: 'Metro Commuter Card Reload',
                transactionDate: '2026-10-06',
                paymentMethod: 'UPI',
                notes: 'Monthly commuter card',
                createdAt: '2026-10-11T15:20:06.048103',
                updatedAt: '2026-10-11T15:20:06.048106'
            },
            {
                id: 3,
                amount: 4500.00,
                category: 'Food',
                description: 'Supermarket Monthly Groceries',
                transactionDate: '2026-10-05',
                paymentMethod: 'UPI',
                notes: 'Fresh produce, dairy and pantry staples',
                createdAt: '2026-10-11T15:20:06.047587',
                updatedAt: '2026-10-11T15:20:06.047590'
            },
            {
                id: 2,
                amount: 3200.00,
                category: 'Bills',
                description: 'High-speed Internet & Electricity',
                transactionDate: '2026-10-04',
                paymentMethod: 'Credit Card',
                notes: 'Utility bills autopay',
                createdAt: '2026-10-11T15:20:06.047112',
                updatedAt: '2026-10-11T15:20:06.047115'
            },
            {
                id: 1,
                amount: 22000.00,
                category: 'Housing',
                description: 'Apartment Monthly Rent',
                transactionDate: '2026-10-02',
                paymentMethod: 'Bank Transfer',
                notes: 'Primary residence lease payment',
                createdAt: '2026-10-11T15:20:06.046491',
                updatedAt: '2026-10-11T15:20:06.046494'
            },
            {
                id: 15,
                amount: 3200.00,
                category: 'Entertainment',
                description: 'Concert Tickets & Movies',
                transactionDate: '2026-09-25',
                paymentMethod: 'Credit Card',
                notes: 'Weekend outing',
                createdAt: '2026-10-11T15:20:06.052527',
                updatedAt: '2026-10-11T15:20:06.052531'
            },
            {
                id: 14,
                amount: 2800.00,
                category: 'Transportation',
                description: 'Fuel & Cab Rides',
                transactionDate: '2026-09-22',
                paymentMethod: 'Credit Card',
                notes: 'Travel & commute',
                createdAt: '2026-10-11T15:20:06.052154',
                updatedAt: '2026-10-11T15:20:06.052158'
            },
            {
                id: 13,
                amount: 3400.00,
                category: 'Bills',
                description: 'Electric & Water Utilities',
                transactionDate: '2026-09-18',
                paymentMethod: 'Bank Transfer',
                notes: 'Monthly utilities',
                createdAt: '2026-10-11T15:20:06.051808',
                updatedAt: '2026-10-11T15:20:06.051811'
            },
            {
                id: 12,
                amount: 9500.00,
                category: 'Food',
                description: 'Monthly Groceries & Dining',
                transactionDate: '2026-09-14',
                paymentMethod: 'Credit Card',
                notes: 'Aggregated groceries',
                createdAt: '2026-10-11T15:20:06.051422',
                updatedAt: '2026-10-11T15:20:06.051426'
            },
            {
                id: 11,
                amount: 22000.00,
                category: 'Housing',
                description: 'Apartment Monthly Rent',
                transactionDate: '2026-09-02',
                paymentMethod: 'Bank Transfer',
                notes: 'Lease payment',
                createdAt: '2026-10-11T15:20:06.051039',
                updatedAt: '2026-10-11T15:20:06.051042'
            },
            {
                id: 18,
                amount: 5500.00,
                category: 'Travel',
                description: 'Weekend Hill Station Getaway',
                transactionDate: '2026-08-19',
                paymentMethod: 'Credit Card',
                notes: 'Resort stay & travel',
                createdAt: '2026-10-11T15:20:06.053594',
                updatedAt: '2026-10-11T15:20:06.053598'
            },
            {
                id: 17,
                amount: 8800.00,
                category: 'Food',
                description: 'Monthly Food Supplies',
                transactionDate: '2026-08-12',
                paymentMethod: 'UPI',
                notes: 'Groceries',
                createdAt: '2026-10-11T15:20:06.053222',
                updatedAt: '2026-10-11T15:20:06.053224'
            },
            {
                id: 16,
                amount: 22000.00,
                category: 'Housing',
                description: 'Apartment Monthly Rent',
                transactionDate: '2026-08-02',
                paymentMethod: 'Bank Transfer',
                notes: 'Lease payment',
                createdAt: '2026-10-11T15:20:06.052901',
                updatedAt: '2026-10-11T15:20:06.052904'
            }
        ];

        const initialBudgets = [
            { id: 1, year: 2026, month: 10, category: 'OVERALL', amount: 60000.00 },
            { id: 2, year: 2026, month: 10, category: 'Food', amount: 12000.00 },
            { id: 3, year: 2026, month: 10, category: 'Transportation', amount: 5000.00 },
            { id: 4, year: 2026, month: 10, category: 'Entertainment', amount: 4000.00 },
            { id: 5, year: 2026, month: 10, category: 'Shopping', amount: 8000.00 }
        ];

        this.saveExpenses(initialExpenses);
        this.saveIncomes(initialIncomes);
        this.saveBudgets(initialBudgets);
    },

    getExpenses() {
        this.init();
        try {
            const raw = JSON.parse(localStorage.getItem(this.STORAGE_KEY_EXPENSES)) || [];
            return raw.map(e => this.normalizeExpense(e));
        } catch (err) {
            return [];
        }
    },

    normalizeExpense(e) {
        const desc = e.description || e.title || 'Expense';
        const date = e.transactionDate || e.expenseDate || e.date || new Date().toISOString().split('T')[0];
        const cat = e.category || 'Other';
        const amt = parseFloat(e.amount) || 0;
        return {
            id: parseInt(e.id, 10) || 1,
            amount: amt,
            category: cat,
            description: desc,
            transactionDate: date,
            paymentMethod: e.paymentMethod || 'UPI',
            notes: e.notes || '',
            createdAt: e.createdAt || new Date().toISOString(),
            updatedAt: e.updatedAt || new Date().toISOString(),
            // Aliases for legacy compatibility
            title: desc,
            expenseDate: date
        };
    },

    saveExpenses(data) {
        const normalized = (data || []).map(e => this.normalizeExpense(e));
        localStorage.setItem(this.STORAGE_KEY_EXPENSES, JSON.stringify(normalized));
    },

    getIncomes() {
        this.init();
        try {
            const raw = JSON.parse(localStorage.getItem(this.STORAGE_KEY_INCOMES)) || [];
            return raw.map(i => this.normalizeIncome(i));
        } catch (err) {
            return [];
        }
    },

    normalizeIncome(i) {
        const desc = i.description || i.title || 'Income';
        const date = i.transactionDate || i.incomeDate || i.date || new Date().toISOString().split('T')[0];
        const cat = i.category || i.sourceCategory || 'Other';
        const amt = parseFloat(i.amount) || 0;
        return {
            id: parseInt(i.id, 10) || 1,
            amount: amt,
            category: cat,
            description: desc,
            transactionDate: date,
            paymentMethod: i.paymentMethod || 'Bank Transfer',
            notes: i.notes || '',
            createdAt: i.createdAt || new Date().toISOString(),
            updatedAt: i.updatedAt || new Date().toISOString(),
            // Aliases for legacy compatibility
            title: desc,
            incomeDate: date,
            sourceCategory: cat
        };
    },

    saveIncomes(data) {
        const normalized = (data || []).map(i => this.normalizeIncome(i));
        localStorage.setItem(this.STORAGE_KEY_INCOMES, JSON.stringify(normalized));
    },

    getBudgets() {
        this.init();
        try {
            const raw = JSON.parse(localStorage.getItem(this.STORAGE_KEY_BUDGETS)) || [];
            return raw.map(b => this.normalizeBudget(b));
        } catch (err) {
            return [];
        }
    },

    normalizeBudget(b) {
        const now = new Date();
        const y = parseInt(b.year || b.budgetYear || now.getFullYear(), 10);
        const m = parseInt(b.month || b.budgetMonth || (now.getMonth() + 1), 10);
        const amt = parseFloat(b.amount || b.limitAmount || 0);
        const cat = b.category || 'OVERALL';
        return {
            id: parseInt(b.id, 10) || 1,
            year: y,
            month: m,
            category: cat,
            amount: amt,
            createdAt: b.createdAt || new Date().toISOString(),
            updatedAt: b.updatedAt || new Date().toISOString(),
            // Aliases for legacy compatibility
            budgetYear: y,
            budgetMonth: m,
            limitAmount: amt
        };
    },

    saveBudgets(data) {
        const normalized = (data || []).map(b => this.normalizeBudget(b));
        localStorage.setItem(this.STORAGE_KEY_BUDGETS, JSON.stringify(normalized));
    },

    resetAllData() {
        localStorage.removeItem(this.STORAGE_KEY_FLAG);
        localStorage.removeItem(this.STORAGE_KEY_EXPENSES);
        localStorage.removeItem(this.STORAGE_KEY_INCOMES);
        localStorage.removeItem(this.STORAGE_KEY_BUDGETS);
        this.init();
    },

    // ===================================================================
    // API Router / Emulation
    // ===================================================================
    async handleRequest(path, options = {}) {
        this.init();
        const method = (options.method || 'GET').toUpperCase();
        const [cleanPath, queryString] = path.split('?');
        const urlParams = new URLSearchParams(queryString || '');
        const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

        // 1. Categories
        if (cleanPath === '/api/expenses/categories') {
            return { success: true, data: this.EXPENSE_CATEGORIES };
        }
        if (cleanPath === '/api/income/categories') {
            return { success: true, data: this.INCOME_CATEGORIES };
        }

        // 2. Dashboard
        if (cleanPath === '/api/dashboard/summary') {
            const now = new Date();
            const year = parseInt(urlParams.get('year') || now.getFullYear(), 10);
            const month = parseInt(urlParams.get('month') || (now.getMonth() + 1), 10);
            return { success: true, data: this.calculateDashboard(year, month) };
        }
        if (cleanPath === '/api/dashboard/monthly') {
            const now = new Date();
            const year = parseInt(urlParams.get('year') || now.getFullYear(), 10);
            const month = parseInt(urlParams.get('month') || (now.getMonth() + 1), 10);
            const count = parseInt(urlParams.get('count') || '6', 10);
            return { success: true, data: this.buildMonthlyTrends(year, month, count) };
        }
        if (cleanPath === '/api/dashboard/categories') {
            const now = new Date();
            const year = parseInt(urlParams.get('year') || now.getFullYear(), 10);
            const month = parseInt(urlParams.get('month') || (now.getMonth() + 1), 10);
            const summary = this.calculateDashboard(year, month);
            return { success: true, data: summary.categoryBreakdown };
        }

        // 3. Budgets
        if (cleanPath === '/api/budgets') {
            if (method === 'GET') {
                const now = new Date();
                const year = parseInt(urlParams.get('year') || now.getFullYear(), 10);
                const month = parseInt(urlParams.get('month') || (now.getMonth() + 1), 10);
                return { success: true, data: this.calculateBudgets(year, month) };
            }
            if (method === 'POST') {
                return { success: true, message: 'Budget saved successfully', data: this.saveBudget(body) };
            }
        }

        const budgetMatch = cleanPath.match(/^\/api\/budgets\/(\d+)$/);
        if (budgetMatch) {
            const id = parseInt(budgetMatch[1], 10);
            if (method === 'GET') {
                const found = this.getBudgets().find(b => b.id === id);
                if (!found) throw new Error('Budget not found with id ' + id);
                return { success: true, data: found };
            }
            if (method === 'PUT') {
                const updated = this.updateBudget(id, body);
                return { success: true, message: 'Budget updated successfully', data: updated };
            }
            if (method === 'DELETE') {
                this.deleteBudget(id);
                return { success: true, message: 'Budget deleted successfully' };
            }
        }

        // 4. Expenses CRUD & Filter
        if (cleanPath === '/api/expenses') {
            if (method === 'GET') {
                return { success: true, data: this.filterExpenses(urlParams) };
            }
            if (method === 'POST') {
                const newExp = this.addExpense(body);
                return { success: true, message: 'Expense recorded successfully', data: newExp };
            }
        }

        const expenseMatch = cleanPath.match(/^\/api\/expenses\/(\d+)$/);
        if (expenseMatch) {
            const id = parseInt(expenseMatch[1], 10);
            if (method === 'GET') {
                const found = this.getExpenses().find(e => e.id === id);
                if (!found) throw new Error('Expense record not found with id ' + id);
                return { success: true, data: found };
            }
            if (method === 'PUT') {
                const updated = this.updateExpense(id, body);
                return { success: true, message: 'Expense updated successfully', data: updated };
            }
            if (method === 'DELETE') {
                this.deleteExpense(id);
                return { success: true, message: 'Expense deleted successfully' };
            }
        }

        // 5. Income CRUD & Filter
        if (cleanPath === '/api/income') {
            if (method === 'GET') {
                return { success: true, data: this.filterIncomes(urlParams) };
            }
            if (method === 'POST') {
                const newInc = this.addIncome(body);
                return { success: true, message: 'Income recorded successfully', data: newInc };
            }
        }

        const incomeMatch = cleanPath.match(/^\/api\/income\/(\d+)$/);
        if (incomeMatch) {
            const id = parseInt(incomeMatch[1], 10);
            if (method === 'GET') {
                const found = this.getIncomes().find(i => i.id === id);
                if (!found) throw new Error('Income record not found with id ' + id);
                return { success: true, data: found };
            }
            if (method === 'PUT') {
                const updated = this.updateIncome(id, body);
                return { success: true, message: 'Income updated successfully', data: updated };
            }
            if (method === 'DELETE') {
                this.deleteIncome(id);
                return { success: true, message: 'Income deleted successfully' };
            }
        }

        // 6. Analytics Reports
        if (cleanPath === '/api/reports/analytics') {
            const startDate = urlParams.get('startDate');
            const endDate = urlParams.get('endDate');
            const category = urlParams.get('category');
            return { success: true, data: this.generateReport(startDate, endDate, category) };
        }
        if (cleanPath === '/api/reports/monthly') {
            const months = parseInt(urlParams.get('months') || '12', 10);
            const now = new Date();
            return { success: true, data: this.buildMonthlyTrends(now.getFullYear(), now.getMonth() + 1, months) };
        }
        if (cleanPath === '/api/reports/categories') {
            const startDate = urlParams.get('startDate');
            const endDate = urlParams.get('endDate');
            const category = urlParams.get('category');
            const report = this.generateReport(startDate, endDate, category);
            return { success: true, data: report.categoryBreakdown };
        }

        throw new Error(`Unhandled mock route: ${method} ${cleanPath}`);
    },

    // ===================================================================
    // Computation Helpers
    // ===================================================================
    filterExpenses(params) {
        const page = parseInt(params.get('page') || '0', 10);
        const size = parseInt(params.get('size') || '10', 10);
        const search = (params.get('search') || '').toLowerCase();
        const category = params.get('category') || '';
        const startDate = params.get('startDate') || '';
        const endDate = params.get('endDate') || '';
        const sortBy = params.get('sortBy') || 'transactionDate';
        const direction = params.get('direction') || 'desc';

        let list = this.getExpenses().slice();

        if (category) {
            list = list.filter(e => e.category === category);
        }
        if (search) {
            list = list.filter(e =>
                (e.description && e.description.toLowerCase().includes(search)) ||
                (e.notes && e.notes.toLowerCase().includes(search)) ||
                (e.paymentMethod && e.paymentMethod.toLowerCase().includes(search))
            );
        }
        if (startDate) {
            list = list.filter(e => e.transactionDate >= startDate);
        }
        if (endDate) {
            list = list.filter(e => e.transactionDate <= endDate);
        }

        // Sorting
        list.sort((a, b) => {
            let valA, valB;
            if (sortBy === 'amount') {
                valA = a.amount;
                valB = b.amount;
            } else {
                valA = a.transactionDate;
                valB = b.transactionDate;
            }
            if (direction === 'asc') return valA > valB ? 1 : valA < valB ? -1 : (a.id - b.id);
            return valA < valB ? 1 : valA > valB ? -1 : (b.id - a.id);
        });

        const totalElements = list.length;
        const totalPages = Math.ceil(totalElements / size) || 1;
        const content = list.slice(page * size, (page + 1) * size);

        return {
            content,
            totalElements,
            totalPages,
            size,
            number: page
        };
    },

    filterIncomes(params) {
        const page = parseInt(params.get('page') || '0', 10);
        const size = parseInt(params.get('size') || '10', 10);
        const search = (params.get('search') || '').toLowerCase();
        const category = params.get('category') || params.get('sourceCategory') || '';
        const startDate = params.get('startDate') || '';
        const endDate = params.get('endDate') || '';
        const sortBy = params.get('sortBy') || 'transactionDate';
        const direction = params.get('direction') || 'desc';

        let list = this.getIncomes().slice();

        if (category) {
            list = list.filter(i => i.category === category);
        }
        if (search) {
            list = list.filter(i =>
                (i.description && i.description.toLowerCase().includes(search)) ||
                (i.notes && i.notes.toLowerCase().includes(search)) ||
                (i.paymentMethod && i.paymentMethod.toLowerCase().includes(search))
            );
        }
        if (startDate) {
            list = list.filter(i => i.transactionDate >= startDate);
        }
        if (endDate) {
            list = list.filter(i => i.transactionDate <= endDate);
        }

        list.sort((a, b) => {
            let valA, valB;
            if (sortBy === 'amount') {
                valA = a.amount;
                valB = b.amount;
            } else {
                valA = a.transactionDate;
                valB = b.transactionDate;
            }
            if (direction === 'asc') return valA > valB ? 1 : valA < valB ? -1 : (a.id - b.id);
            return valA < valB ? 1 : valA > valB ? -1 : (b.id - a.id);
        });

        const totalElements = list.length;
        const totalPages = Math.ceil(totalElements / size) || 1;
        const content = list.slice(page * size, (page + 1) * size);

        return {
            content,
            totalElements,
            totalPages,
            size,
            number: page
        };
    },

    addExpense(body) {
        const list = this.getExpenses();
        const newId = list.length ? Math.max(...list.map(e => e.id)) + 1 : 1;
        const desc = body.description || body.title || 'Expense';
        const date = body.transactionDate || body.expenseDate || new Date().toISOString().split('T')[0];
        const newExpense = {
            id: newId,
            amount: parseFloat(body.amount) || 0,
            category: body.category || 'Other',
            description: desc,
            transactionDate: date,
            paymentMethod: body.paymentMethod || 'UPI',
            notes: body.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        list.unshift(newExpense);
        this.saveExpenses(list);
        return this.normalizeExpense(newExpense);
    },

    updateExpense(id, body) {
        const list = this.getExpenses();
        const idx = list.findIndex(e => e.id === id);
        if (idx === -1) throw new Error('Expense not found');
        const desc = body.description !== undefined ? body.description : (body.title !== undefined ? body.title : list[idx].description);
        const date = body.transactionDate || body.expenseDate || list[idx].transactionDate;
        list[idx] = {
            ...list[idx],
            amount: body.amount !== undefined ? parseFloat(body.amount) : list[idx].amount,
            category: body.category || list[idx].category,
            description: desc,
            transactionDate: date,
            paymentMethod: body.paymentMethod || list[idx].paymentMethod,
            notes: body.notes !== undefined ? body.notes : list[idx].notes,
            updatedAt: new Date().toISOString()
        };
        this.saveExpenses(list);
        return this.normalizeExpense(list[idx]);
    },

    deleteExpense(id) {
        let list = this.getExpenses();
        list = list.filter(e => e.id !== id);
        this.saveExpenses(list);
    },

    addIncome(body) {
        const list = this.getIncomes();
        const newId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
        const desc = body.description || body.title || 'Income';
        const date = body.transactionDate || body.incomeDate || new Date().toISOString().split('T')[0];
        const cat = body.category || body.sourceCategory || 'Salary';
        const newIncome = {
            id: newId,
            amount: parseFloat(body.amount) || 0,
            category: cat,
            description: desc,
            transactionDate: date,
            paymentMethod: body.paymentMethod || 'Bank Transfer',
            notes: body.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        list.unshift(newIncome);
        this.saveIncomes(list);
        return this.normalizeIncome(newIncome);
    },

    updateIncome(id, body) {
        const list = this.getIncomes();
        const idx = list.findIndex(i => i.id === id);
        if (idx === -1) throw new Error('Income not found');
        const desc = body.description !== undefined ? body.description : (body.title !== undefined ? body.title : list[idx].description);
        const date = body.transactionDate || body.incomeDate || list[idx].transactionDate;
        const cat = body.category || body.sourceCategory || list[idx].category;
        list[idx] = {
            ...list[idx],
            amount: body.amount !== undefined ? parseFloat(body.amount) : list[idx].amount,
            category: cat,
            description: desc,
            transactionDate: date,
            paymentMethod: body.paymentMethod || list[idx].paymentMethod,
            notes: body.notes !== undefined ? body.notes : list[idx].notes,
            updatedAt: new Date().toISOString()
        };
        this.saveIncomes(list);
        return this.normalizeIncome(list[idx]);
    },

    deleteIncome(id) {
        let list = this.getIncomes();
        list = list.filter(i => i.id !== id);
        this.saveIncomes(list);
    },

    saveBudget(body) {
        const list = this.getBudgets();
        const now = new Date();
        const year = parseInt(body.year || body.budgetYear || now.getFullYear(), 10);
        const month = parseInt(body.month || body.budgetMonth || (now.getMonth() + 1), 10);
        const category = body.category || 'OVERALL';
        const amount = parseFloat(body.amount !== undefined ? body.amount : (body.limitAmount || 0));

        const existing = list.find(b => b.year === year && b.month === month && b.category === category);
        if (existing) {
            existing.amount = amount;
            existing.updatedAt = new Date().toISOString();
            this.saveBudgets(list);
            return this.normalizeBudget(existing);
        } else {
            const newId = list.length ? Math.max(...list.map(b => b.id)) + 1 : 1;
            const newBudget = {
                id: newId,
                year,
                month,
                category,
                amount,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            list.push(newBudget);
            this.saveBudgets(list);
            return this.normalizeBudget(newBudget);
        }
    },

    updateBudget(id, body) {
        const list = this.getBudgets();
        const idx = list.findIndex(b => b.id === id);
        if (idx === -1) throw new Error('Budget not found');
        if (body.amount !== undefined) list[idx].amount = parseFloat(body.amount);
        if (body.limitAmount !== undefined) list[idx].amount = parseFloat(body.limitAmount);
        if (body.category) list[idx].category = body.category;
        if (body.year) list[idx].year = parseInt(body.year, 10);
        if (body.month) list[idx].month = parseInt(body.month, 10);
        list[idx].updatedAt = new Date().toISOString();
        this.saveBudgets(list);
        return this.normalizeBudget(list[idx]);
    },

    deleteBudget(id) {
        let list = this.getBudgets();
        list = list.filter(b => b.id !== id);
        this.saveBudgets(list);
    },

    calculateBudgets(year, month) {
        const budgets = this.getBudgets().filter(b => b.year === year && b.month === month);
        const expenses = this.getExpenses().filter(e => {
            const [y, m] = this.parseDateParts(e.transactionDate);
            return y === year && m === month;
        });

        return budgets.map(b => {
            let spent = 0;
            if (b.category === 'OVERALL') {
                spent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
            } else {
                spent = expenses.filter(e => e.category === b.category).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
            }
            const limit = b.amount || 0;
            const remaining = Math.max(0, limit - spent);
            const percentage = limit > 0 ? (spent / limit) * 100 : 0;
            const pctFixed = Math.round(percentage * 100) / 100;
            return {
                id: b.id,
                year: b.year,
                month: b.month,
                category: b.category,
                amount: limit,
                spentAmount: spent,
                remainingAmount: remaining,
                percentageUsed: pctFixed,
                warning: percentage >= 80 && percentage <= 100,
                exceeded: percentage > 100,
                createdAt: b.createdAt,
                updatedAt: b.updatedAt,
                // Aliases for compatibility
                budgetYear: b.year,
                budgetMonth: b.month,
                limitAmount: limit,
                spentPercentage: pctFixed,
                isWarning: percentage >= 80 && percentage <= 100,
                isExceeded: percentage > 100
            };
        });
    },

    buildMonthlyTrends(targetYear, targetMonth, count = 6) {
        const allExpenses = this.getExpenses();
        const allIncomes = this.getIncomes();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const list = [];

        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(targetYear, (targetMonth - 1) - i, 1);
            const curY = d.getFullYear();
            const curM = d.getMonth() + 1;

            const curExp = allExpenses
                .filter(e => {
                    const [y, m] = this.parseDateParts(e.transactionDate);
                    return y === curY && m === curM;
                })
                .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

            const curInc = allIncomes
                .filter(inc => {
                    const [y, m] = this.parseDateParts(inc.transactionDate);
                    return y === curY && m === curM;
                })
                .reduce((s, inc) => s + (parseFloat(inc.amount) || 0), 0);

            const label = `${monthNames[curM - 1]} ${curY}`;
            list.push({
                year: curY,
                month: curM,
                monthLabel: label,
                monthName: label,
                income: curInc,
                expense: curExp,
                expenses: curExp,
                netSavings: curInc - curExp
            });
        }
        return list;
    },

    calculateDashboard(year, month) {
        const allExpenses = this.getExpenses();
        const allIncomes = this.getIncomes();

        const monthExpenses = allExpenses.filter(e => {
            const [y, m] = this.parseDateParts(e.transactionDate);
            return y === year && m === month;
        });

        const monthIncomes = allIncomes.filter(i => {
            const [y, m] = this.parseDateParts(i.transactionDate);
            return y === year && m === month;
        });

        const totalExpenses = monthExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
        const totalIncome = monthIncomes.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
        const totalBalance = totalIncome - totalExpenses;

        // Overall Budget
        const allBudgets = this.getBudgets();
        const overallBudget = allBudgets.find(b => b.year === year && b.month === month && b.category === 'OVERALL');
        const monthlyBudget = overallBudget ? overallBudget.amount : 0;
        const remainingBudget = Math.max(0, monthlyBudget - totalExpenses);
        let budgetUsedPercent = 0.0;
        if (monthlyBudget > 0) {
            budgetUsedPercent = (totalExpenses / monthlyBudget) * 100;
            budgetUsedPercent = Math.round(budgetUsedPercent * 100) / 100;
        }
        const budgetWarning = budgetUsedPercent >= 80 && budgetUsedPercent <= 100;
        const budgetExceeded = budgetUsedPercent > 100;

        // Category breakdown
        const catMap = {};
        monthExpenses.forEach(e => {
            catMap[e.category] = (catMap[e.category] || 0) + (parseFloat(e.amount) || 0);
        });

        let highestCategoryName = 'None';
        let highestCategoryAmount = 0;
        const categoryBreakdown = Object.keys(catMap).map(cat => {
            const amt = catMap[cat];
            if (amt > highestCategoryAmount) {
                highestCategoryAmount = amt;
                highestCategoryName = cat;
            }
            return {
                category: cat,
                amount: amt,
                percentage: totalExpenses > 0 ? parseFloat(((amt / totalExpenses) * 100).toFixed(2)) : 0
            };
        }).sort((a, b) => b.amount - a.amount);

        // 6 Month Trend
        const monthlyTrends = this.buildMonthlyTrends(year, month, 6);

        // Recent transactions (up to 8 combined sorted by date desc)
        const combined = [
            ...allExpenses.map(e => ({
                id: e.id,
                type: 'EXPENSE',
                category: e.category,
                description: e.description,
                transactionDate: e.transactionDate,
                amount: e.amount,
                paymentMethod: e.paymentMethod,
                title: e.description,
                date: e.transactionDate
            })),
            ...allIncomes.map(i => ({
                id: i.id,
                type: 'INCOME',
                category: i.category,
                description: i.description,
                transactionDate: i.transactionDate,
                amount: i.amount,
                paymentMethod: i.paymentMethod,
                title: i.description,
                date: i.transactionDate
            }))
        ];
        combined.sort((a, b) => {
            if (b.transactionDate !== a.transactionDate) {
                return b.transactionDate > a.transactionDate ? 1 : -1;
            }
            return b.id - a.id;
        });
        const recentTransactions = combined.slice(0, 8);

        return {
            year,
            month,
            totalBalance,
            totalIncome,
            totalExpenses,
            monthlyBudget,
            remainingBudget,
            budgetUsedPercentage: budgetUsedPercent,
            budgetWarning,
            budgetExceeded,
            highestCategoryName,
            highestCategoryAmount,
            categoryBreakdown,
            monthlyTrends,
            recentTransactions,
            // Aliases for compatibility
            overallBudgetLimit: monthlyBudget,
            overallSpent: totalExpenses,
            overallRemaining: remainingBudget,
            overallSpentPercentage: budgetUsedPercent,
            isBudgetExceeded: budgetExceeded,
            isBudgetWarning: budgetWarning,
            topSpendingCategory: highestCategoryName,
            cashFlowTrend: monthlyTrends
        };
    },

    generateReport(startDate, endDate, filterCategory) {
        let expenses = this.getExpenses();
        let incomes = this.getIncomes();

        if (startDate) {
            expenses = expenses.filter(e => e.transactionDate >= startDate);
            incomes = incomes.filter(i => i.transactionDate >= startDate);
        }
        if (endDate) {
            expenses = expenses.filter(e => e.transactionDate <= endDate);
            incomes = incomes.filter(i => i.transactionDate <= endDate);
        }
        if (filterCategory) {
            expenses = expenses.filter(e => e.category === filterCategory);
        }

        const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
        const totalIncome = incomes.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
        const netSavings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? parseFloat(((netSavings / totalIncome) * 100).toFixed(2)) : 0;

        // Highest and lowest single expense
        let highestExpense = null;
        let lowestExpense = null;
        if (expenses.length > 0) {
            const sortedByAmt = expenses.slice().sort((a, b) => b.amount - a.amount);
            highestExpense = sortedByAmt[0];
            lowestExpense = sortedByAmt[sortedByAmt.length - 1];
        }

        // Category breakdown
        const catMap = {};
        expenses.forEach(e => {
            catMap[e.category] = (catMap[e.category] || 0) + (parseFloat(e.amount) || 0);
        });
        const categoryBreakdown = Object.keys(catMap).map(cat => ({
            category: cat,
            amount: catMap[cat],
            percentage: totalExpenses > 0 ? parseFloat(((catMap[cat] / totalExpenses) * 100).toFixed(2)) : 0
        })).sort((a, b) => b.amount - a.amount);

        // Monthly comparison in range
        const monthsMap = {};
        expenses.forEach(e => {
            const ym = e.transactionDate.substring(0, 7);
            if (!monthsMap[ym]) monthsMap[ym] = { income: 0, expenses: 0 };
            monthsMap[ym].expenses += e.amount;
        });
        incomes.forEach(i => {
            const ym = i.transactionDate.substring(0, 7);
            if (!monthsMap[ym]) monthsMap[ym] = { income: 0, expenses: 0 };
            monthsMap[ym].income += i.amount;
        });

        const monthKeys = Object.keys(monthsMap).sort();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTrends = monthKeys.map(ym => {
            const [y, m] = this.parseDateParts(ym + '-01');
            const inc = monthsMap[ym].income;
            const exp = monthsMap[ym].expenses;
            const label = `${monthNames[m - 1]} ${y}`;
            return {
                year: y,
                month: m,
                monthLabel: label,
                monthName: label,
                income: inc,
                expense: exp,
                expenses: exp,
                netSavings: inc - exp
            };
        });

        return {
            periodLabel: startDate && endDate ? `${startDate} to ${endDate}` : 'All Time Overview',
            totalIncome,
            totalExpenses,
            netSavings,
            savingsRate,
            highestExpense,
            lowestExpense,
            totalExpenseCount: expenses.length,
            averageExpenseAmount: expenses.length > 0 ? parseFloat((totalExpenses / expenses.length).toFixed(2)) : 0,
            monthlyTrends,
            monthlyComparison: monthlyTrends,
            categoryBreakdown
        };
    }
};

window.MockStore = MockStore;
