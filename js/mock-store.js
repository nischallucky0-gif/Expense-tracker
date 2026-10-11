/**
 * SpendFlow - Mock Storage & Client-Side Engine
 * Provides persistent in-browser LocalStorage data and API emulation
 * Ensures full interactive functionality when running on Vercel or when Spring Boot is offline.
 */

const MockStore = {
    EXPENSE_CATEGORIES: [
        'Food', 'Transportation', 'Housing', 'Bills',
        'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Travel', 'Other'
    ],

    INCOME_CATEGORIES: [
        'Salary', 'Freelance', 'Business', 'Investments', 'Other'
    ],

    init() {
        if (!localStorage.getItem('spendflow_initialized_v2')) {
            this.seedInitialData();
            localStorage.setItem('spendflow_initialized_v2', 'true');
        }
    },

    seedInitialData() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-indexed

        const formatIso = (year, month, day) => {
            const m = String(month).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${year}-${m}-${d}`;
        };

        const lastMonthDate = new Date(currentYear, currentMonth - 2, 1);
        const lastYear = lastMonthDate.getFullYear();
        const lastMonth = lastMonthDate.getMonth() + 1;

        const twoMonthsAgoDate = new Date(currentYear, currentMonth - 3, 1);
        const twoMonthsYear = twoMonthsAgoDate.getFullYear();
        const twoMonthsMonth = twoMonthsAgoDate.getMonth() + 1;

        // 1. Initial Incomes
        const initialIncomes = [
            {
                id: 1,
                title: 'Monthly Tech Corp Salary',
                amount: 85000.00,
                sourceCategory: 'Salary',
                incomeDate: formatIso(currentYear, currentMonth, 1),
                paymentMethod: 'Bank Transfer',
                notes: 'Direct deposit regular payroll',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Mobile App UI Design Project',
                amount: 15000.00,
                sourceCategory: 'Freelance',
                incomeDate: formatIso(currentYear, currentMonth, 8),
                paymentMethod: 'Bank Transfer',
                notes: 'Client invoice #104',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Quarterly Mutual Fund Dividend',
                amount: 3500.00,
                sourceCategory: 'Investments',
                incomeDate: formatIso(currentYear, currentMonth, 12),
                paymentMethod: 'Bank Transfer',
                notes: 'Index fund dividend distribution',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Monthly Tech Corp Salary',
                amount: 85000.00,
                sourceCategory: 'Salary',
                incomeDate: formatIso(lastYear, lastMonth, 1),
                paymentMethod: 'Bank Transfer',
                notes: 'Direct deposit regular payroll',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Backend API Consulting',
                amount: 20000.00,
                sourceCategory: 'Freelance',
                incomeDate: formatIso(lastYear, lastMonth, 15),
                paymentMethod: 'Bank Transfer',
                notes: 'Consulting contract',
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: 'Monthly Tech Corp Salary',
                amount: 80000.00,
                sourceCategory: 'Salary',
                incomeDate: formatIso(twoMonthsYear, twoMonthsMonth, 1),
                paymentMethod: 'Bank Transfer',
                notes: 'Direct deposit regular payroll',
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                title: 'E-commerce Affiliate Income',
                amount: 6000.00,
                sourceCategory: 'Business',
                incomeDate: formatIso(twoMonthsYear, twoMonthsMonth, 20),
                paymentMethod: 'Bank Transfer',
                notes: 'Monthly affiliate commission',
                createdAt: new Date().toISOString()
            }
        ];

        // 2. Initial Expenses
        const initialExpenses = [
            {
                id: 1,
                title: 'Apartment Monthly Rent',
                amount: 22000.00,
                category: 'Housing',
                expenseDate: formatIso(currentYear, currentMonth, 2),
                paymentMethod: 'Bank Transfer',
                notes: 'Primary residence lease payment',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'High-speed Internet & Electricity',
                amount: 3200.00,
                category: 'Bills',
                expenseDate: formatIso(currentYear, currentMonth, 4),
                paymentMethod: 'Credit Card',
                notes: 'Utility bills autopay',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Supermarket Monthly Groceries',
                amount: 4500.00,
                category: 'Food',
                expenseDate: formatIso(currentYear, currentMonth, 5),
                paymentMethod: 'UPI',
                notes: 'Fresh produce, dairy and pantry staples',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Metro Commuter Card Reload',
                amount: 1200.00,
                category: 'Transportation',
                expenseDate: formatIso(currentYear, currentMonth, 6),
                paymentMethod: 'UPI',
                notes: 'Monthly commuter card',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Ergonomic Desk Accessories',
                amount: 2499.00,
                category: 'Shopping',
                expenseDate: formatIso(currentYear, currentMonth, 7),
                paymentMethod: 'Credit Card',
                notes: 'Wireless keyboard & wrist rest',
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: 'Dinner with Friends at Restaurant',
                amount: 1850.00,
                category: 'Food',
                expenseDate: formatIso(currentYear, currentMonth, 9),
                paymentMethod: 'Credit Card',
                notes: 'Friday team celebration',
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                title: 'Prescription & Vitamins',
                amount: 650.00,
                category: 'Healthcare',
                expenseDate: formatIso(currentYear, currentMonth, 10),
                paymentMethod: 'Cash',
                notes: 'Neighborhood pharmacy',
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                title: 'Video & Music Streaming Plans',
                amount: 999.00,
                category: 'Entertainment',
                expenseDate: formatIso(currentYear, currentMonth, 11),
                paymentMethod: 'Credit Card',
                notes: 'Netflix & Spotify subscriptions',
                createdAt: new Date().toISOString()
            },
            {
                id: 9,
                title: 'Midweek Grocery & Snacks',
                amount: 2100.00,
                category: 'Food',
                expenseDate: formatIso(currentYear, currentMonth, 12),
                paymentMethod: 'UPI',
                notes: 'Groceries and fruits',
                createdAt: new Date().toISOString()
            },
            {
                id: 10,
                title: 'Fuel & Vehicle Service',
                amount: 2500.00,
                category: 'Transportation',
                expenseDate: formatIso(currentYear, currentMonth, 13),
                paymentMethod: 'UPI',
                notes: 'Fuel station',
                createdAt: new Date().toISOString()
            },
            {
                id: 11,
                title: 'Apartment Monthly Rent',
                amount: 22000.00,
                category: 'Housing',
                expenseDate: formatIso(lastYear, lastMonth, 2),
                paymentMethod: 'Bank Transfer',
                notes: 'Lease payment',
                createdAt: new Date().toISOString()
            },
            {
                id: 12,
                title: 'Monthly Groceries & Dining',
                amount: 9500.00,
                category: 'Food',
                expenseDate: formatIso(lastYear, lastMonth, 14),
                paymentMethod: 'Credit Card',
                notes: 'Aggregated groceries',
                createdAt: new Date().toISOString()
            },
            {
                id: 13,
                title: 'Electric & Water Utilities',
                amount: 3400.00,
                category: 'Bills',
                expenseDate: formatIso(lastYear, lastMonth, 18),
                paymentMethod: 'Bank Transfer',
                notes: 'Monthly utilities',
                createdAt: new Date().toISOString()
            },
            {
                id: 14,
                title: 'Fuel & Cab Rides',
                amount: 2800.00,
                category: 'Transportation',
                expenseDate: formatIso(lastYear, lastMonth, 22),
                paymentMethod: 'Credit Card',
                notes: 'Travel & commute',
                createdAt: new Date().toISOString()
            },
            {
                id: 15,
                title: 'Concert Tickets & Movies',
                amount: 3200.00,
                category: 'Entertainment',
                expenseDate: formatIso(lastYear, lastMonth, 25),
                paymentMethod: 'Credit Card',
                notes: 'Weekend outing',
                createdAt: new Date().toISOString()
            },
            {
                id: 16,
                title: 'Apartment Monthly Rent',
                amount: 22000.00,
                category: 'Housing',
                expenseDate: formatIso(twoMonthsYear, twoMonthsMonth, 2),
                paymentMethod: 'Bank Transfer',
                notes: 'Lease payment',
                createdAt: new Date().toISOString()
            },
            {
                id: 17,
                title: 'Monthly Food Supplies',
                amount: 8800.00,
                category: 'Food',
                expenseDate: formatIso(twoMonthsYear, twoMonthsMonth, 12),
                paymentMethod: 'UPI',
                notes: 'Groceries',
                createdAt: new Date().toISOString()
            },
            {
                id: 18,
                title: 'Weekend Hill Station Getaway',
                amount: 5500.00,
                category: 'Travel',
                expenseDate: formatIso(twoMonthsYear, twoMonthsMonth, 19),
                paymentMethod: 'Credit Card',
                notes: 'Resort stay & travel',
                createdAt: new Date().toISOString()
            }
        ];

        // 3. Initial Budgets
        const initialBudgets = [
            { id: 1, budgetYear: currentYear, budgetMonth: currentMonth, category: 'OVERALL', limitAmount: 60000.00 },
            { id: 2, budgetYear: currentYear, budgetMonth: currentMonth, category: 'Food', limitAmount: 12000.00 },
            { id: 3, budgetYear: currentYear, budgetMonth: currentMonth, category: 'Transportation', limitAmount: 5000.00 },
            { id: 4, budgetYear: currentYear, budgetMonth: currentMonth, category: 'Entertainment', limitAmount: 4000.00 },
            { id: 5, budgetYear: currentYear, budgetMonth: currentMonth, category: 'Shopping', limitAmount: 8000.00 }
        ];

        localStorage.setItem('spendflow_expenses', JSON.stringify(initialExpenses));
        localStorage.setItem('spendflow_incomes', JSON.stringify(initialIncomes));
        localStorage.setItem('spendflow_budgets', JSON.stringify(initialBudgets));
    },

    getExpenses() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem('spendflow_expenses')) || [];
        } catch (e) {
            return [];
        }
    },

    saveExpenses(data) {
        localStorage.setItem('spendflow_expenses', JSON.stringify(data));
    },

    getIncomes() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem('spendflow_incomes')) || [];
        } catch (e) {
            return [];
        }
    },

    saveIncomes(data) {
        localStorage.setItem('spendflow_incomes', JSON.stringify(data));
    },

    getBudgets() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem('spendflow_budgets')) || [];
        } catch (e) {
            return [];
        }
    },

    saveBudgets(data) {
        localStorage.setItem('spendflow_budgets', JSON.stringify(data));
    },

    resetAllData() {
        localStorage.removeItem('spendflow_initialized_v2');
        localStorage.removeItem('spendflow_expenses');
        localStorage.removeItem('spendflow_incomes');
        localStorage.removeItem('spendflow_budgets');
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
        const body = options.body ? JSON.parse(options.body) : {};

        // 1. Categories
        if (cleanPath === '/api/expenses/categories') {
            return { success: true, data: this.EXPENSE_CATEGORIES };
        }
        if (cleanPath === '/api/income/categories') {
            return { success: true, data: this.INCOME_CATEGORIES };
        }

        // 2. Dashboard Summary
        if (cleanPath === '/api/dashboard/summary') {
            const year = parseInt(urlParams.get('year') || new Date().getFullYear(), 10);
            const month = parseInt(urlParams.get('month') || (new Date().getMonth() + 1), 10);
            return { success: true, data: this.calculateDashboard(year, month) };
        }

        // 3. Budgets
        if (cleanPath === '/api/budgets') {
            if (method === 'GET') {
                const year = parseInt(urlParams.get('year') || new Date().getFullYear(), 10);
                const month = parseInt(urlParams.get('month') || (new Date().getMonth() + 1), 10);
                return { success: true, data: this.calculateBudgets(year, month) };
            }
            if (method === 'POST') {
                return { success: true, message: 'Budget saved successfully', data: this.saveBudget(body) };
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
            return { success: true, data: this.generateReport(startDate, endDate) };
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
                (e.title && e.title.toLowerCase().includes(search)) ||
                (e.notes && e.notes.toLowerCase().includes(search))
            );
        }
        if (startDate) {
            list = list.filter(e => e.expenseDate >= startDate);
        }
        if (endDate) {
            list = list.filter(e => e.expenseDate <= endDate);
        }

        // Sorting
        list.sort((a, b) => {
            let valA, valB;
            if (sortBy === 'amount') {
                valA = a.amount;
                valB = b.amount;
            } else {
                valA = a.expenseDate;
                valB = b.expenseDate;
            }
            if (direction === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
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
        const sourceCategory = params.get('sourceCategory') || '';
        const startDate = params.get('startDate') || '';
        const endDate = params.get('endDate') || '';

        let list = this.getIncomes().slice();

        if (sourceCategory) {
            list = list.filter(i => i.sourceCategory === sourceCategory);
        }
        if (search) {
            list = list.filter(i =>
                (i.title && i.title.toLowerCase().includes(search)) ||
                (i.notes && i.notes.toLowerCase().includes(search))
            );
        }
        if (startDate) {
            list = list.filter(i => i.incomeDate >= startDate);
        }
        if (endDate) {
            list = list.filter(i => i.incomeDate <= endDate);
        }

        list.sort((a, b) => (a.incomeDate < b.incomeDate ? 1 : -1));

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
        const newExpense = {
            id: newId,
            title: body.title,
            amount: parseFloat(body.amount),
            category: body.category,
            expenseDate: body.expenseDate,
            paymentMethod: body.paymentMethod || 'UPI',
            notes: body.notes || '',
            createdAt: new Date().toISOString()
        };
        list.unshift(newExpense);
        this.saveExpenses(list);
        return newExpense;
    },

    updateExpense(id, body) {
        const list = this.getExpenses();
        const idx = list.findIndex(e => e.id === id);
        if (idx === -1) throw new Error('Expense not found');
        list[idx] = {
            ...list[idx],
            title: body.title,
            amount: parseFloat(body.amount),
            category: body.category,
            expenseDate: body.expenseDate,
            paymentMethod: body.paymentMethod || list[idx].paymentMethod,
            notes: body.notes !== undefined ? body.notes : list[idx].notes
        };
        this.saveExpenses(list);
        return list[idx];
    },

    deleteExpense(id) {
        let list = this.getExpenses();
        list = list.filter(e => e.id !== id);
        this.saveExpenses(list);
    },

    addIncome(body) {
        const list = this.getIncomes();
        const newId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
        const newIncome = {
            id: newId,
            title: body.title,
            amount: parseFloat(body.amount),
            sourceCategory: body.sourceCategory,
            incomeDate: body.incomeDate,
            paymentMethod: body.paymentMethod || 'Bank Transfer',
            notes: body.notes || '',
            createdAt: new Date().toISOString()
        };
        list.unshift(newIncome);
        this.saveIncomes(list);
        return newIncome;
    },

    updateIncome(id, body) {
        const list = this.getIncomes();
        const idx = list.findIndex(i => i.id === id);
        if (idx === -1) throw new Error('Income not found');
        list[idx] = {
            ...list[idx],
            title: body.title,
            amount: parseFloat(body.amount),
            sourceCategory: body.sourceCategory,
            incomeDate: body.incomeDate,
            paymentMethod: body.paymentMethod || list[idx].paymentMethod,
            notes: body.notes !== undefined ? body.notes : list[idx].notes
        };
        this.saveIncomes(list);
        return list[idx];
    },

    deleteIncome(id) {
        let list = this.getIncomes();
        list = list.filter(i => i.id !== id);
        this.saveIncomes(list);
    },

    saveBudget(body) {
        const list = this.getBudgets();
        const year = parseInt(body.budgetYear, 10);
        const month = parseInt(body.budgetMonth, 10);
        const category = body.category;
        const limitAmount = parseFloat(body.amount);

        const existing = list.find(b => b.budgetYear === year && b.budgetMonth === month && b.category === category);
        if (existing) {
            existing.limitAmount = limitAmount;
            this.saveBudgets(list);
            return existing;
        } else {
            const newId = list.length ? Math.max(...list.map(b => b.id)) + 1 : 1;
            const newBudget = { id: newId, budgetYear: year, budgetMonth: month, category, limitAmount };
            list.push(newBudget);
            this.saveBudgets(list);
            return newBudget;
        }
    },

    calculateBudgets(year, month) {
        const budgets = this.getBudgets().filter(b => b.budgetYear === year && b.budgetMonth === month);
        const expenses = this.getExpenses().filter(e => {
            const [y, m] = e.expenseDate.split('-').map(Number);
            return y === year && m === month;
        });

        return budgets.map(b => {
            let spent = 0;
            if (b.category === 'OVERALL') {
                spent = expenses.reduce((sum, e) => sum + e.amount, 0);
            } else {
                spent = expenses.filter(e => e.category === b.category).reduce((sum, e) => sum + e.amount, 0);
            }
            const limit = b.limitAmount || 0;
            const remaining = Math.max(0, limit - spent);
            const percentage = limit > 0 ? (spent / limit) * 100 : 0;
            return {
                id: b.id,
                budgetYear: b.budgetYear,
                budgetMonth: b.budgetMonth,
                category: b.category,
                limitAmount: limit,
                spentAmount: spent,
                remainingAmount: remaining,
                spentPercentage: parseFloat(percentage.toFixed(2)),
                isWarning: percentage >= 80 && percentage <= 100,
                isExceeded: percentage > 100
            };
        });
    },

    calculateDashboard(year, month) {
        const allExpenses = this.getExpenses();
        const allIncomes = this.getIncomes();

        const monthExpenses = allExpenses.filter(e => {
            const [y, m] = e.expenseDate.split('-').map(Number);
            return y === year && m === month;
        });

        const monthIncomes = allIncomes.filter(i => {
            const [y, m] = i.incomeDate.split('-').map(Number);
            return y === year && m === month;
        });

        const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
        const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
        const totalBalance = totalIncome - totalExpenses;

        // Overall Budget
        const overallBudget = this.getBudgets().find(b => b.budgetYear === year && b.budgetMonth === month && b.category === 'OVERALL');
        const overallLimit = overallBudget ? overallBudget.limitAmount : 0;
        const overallRemaining = Math.max(0, overallLimit - totalExpenses);
        const overallSpentPercentage = overallLimit > 0 ? (totalExpenses / overallLimit) * 100 : 0;

        // Category breakdown
        const catMap = {};
        monthExpenses.forEach(e => {
            catMap[e.category] = (catMap[e.category] || 0) + e.amount;
        });

        let topCategory = 'None';
        let maxCatAmount = 0;
        const categoryBreakdown = Object.keys(catMap).map(cat => {
            const amt = catMap[cat];
            if (amt > maxCatAmount) {
                maxCatAmount = amt;
                topCategory = cat;
            }
            return {
                category: cat,
                amount: amt,
                percentage: totalExpenses > 0 ? parseFloat(((amt / totalExpenses) * 100).toFixed(2)) : 0
            };
        });

        // 6 Month Trend
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const cashFlowTrend = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(year, month - 1 - i, 1);
            const curY = d.getFullYear();
            const curM = d.getMonth() + 1;

            const curExp = allExpenses
                .filter(e => {
                    const [y, m] = e.expenseDate.split('-').map(Number);
                    return y === curY && m === curM;
                })
                .reduce((s, e) => s + e.amount, 0);

            const curInc = allIncomes
                .filter(inc => {
                    const [y, m] = inc.incomeDate.split('-').map(Number);
                    return y === curY && m === curM;
                })
                .reduce((s, inc) => s + inc.amount, 0);

            cashFlowTrend.push({
                year: curY,
                month: curM,
                monthName: monthNames[curM - 1],
                income: curInc,
                expenses: curExp,
                netSavings: curInc - curExp
            });
        }

        // Recent transactions (last 6 across income & expense)
        const combined = [
            ...monthExpenses.map(e => ({
                id: e.id,
                title: e.title,
                type: 'EXPENSE',
                category: e.category,
                amount: e.amount,
                date: e.expenseDate,
                paymentMethod: e.paymentMethod
            })),
            ...monthIncomes.map(i => ({
                id: i.id,
                title: i.title,
                type: 'INCOME',
                category: i.sourceCategory,
                amount: i.amount,
                date: i.incomeDate,
                paymentMethod: i.paymentMethod
            }))
        ];
        combined.sort((a, b) => (a.date < b.date ? 1 : -1));
        const recentTransactions = combined.slice(0, 6);

        return {
            totalBalance,
            totalIncome,
            totalExpenses,
            overallBudgetLimit: overallLimit,
            overallSpent: totalExpenses,
            overallRemaining,
            overallSpentPercentage: parseFloat(overallSpentPercentage.toFixed(2)),
            isBudgetExceeded: overallSpentPercentage > 100,
            isBudgetWarning: overallSpentPercentage >= 80 && overallSpentPercentage <= 100,
            topSpendingCategory: topCategory,
            cashFlowTrend,
            categoryBreakdown,
            recentTransactions
        };
    },

    generateReport(startDate, endDate) {
        let expenses = this.getExpenses();
        let incomes = this.getIncomes();

        if (startDate) {
            expenses = expenses.filter(e => e.expenseDate >= startDate);
            incomes = incomes.filter(i => i.incomeDate >= startDate);
        }
        if (endDate) {
            expenses = expenses.filter(e => e.expenseDate <= endDate);
            incomes = incomes.filter(i => i.incomeDate <= endDate);
        }

        const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
        const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
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
            catMap[e.category] = (catMap[e.category] || 0) + e.amount;
        });
        const categoryBreakdown = Object.keys(catMap).map(cat => ({
            category: cat,
            amount: catMap[cat],
            percentage: totalExpenses > 0 ? parseFloat(((catMap[cat] / totalExpenses) * 100).toFixed(2)) : 0
        }));

        // Monthly comparison in range
        const monthsMap = {};
        expenses.forEach(e => {
            const ym = e.expenseDate.substring(0, 7);
            if (!monthsMap[ym]) monthsMap[ym] = { income: 0, expenses: 0 };
            monthsMap[ym].expenses += e.amount;
        });
        incomes.forEach(i => {
            const ym = i.incomeDate.substring(0, 7);
            if (!monthsMap[ym]) monthsMap[ym] = { income: 0, expenses: 0 };
            monthsMap[ym].income += i.amount;
        });

        const monthKeys = Object.keys(monthsMap).sort();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyComparison = monthKeys.map(ym => {
            const [y, m] = ym.split('-').map(Number);
            const inc = monthsMap[ym].income;
            const exp = monthsMap[ym].expenses;
            return {
                year: y,
                month: m,
                monthName: `${monthNames[m - 1]} ${y}`,
                income: inc,
                expenses: exp,
                netSavings: inc - exp
            };
        });

        return {
            totalIncome,
            totalExpenses,
            netSavings,
            savingsRate,
            highestExpense,
            lowestExpense,
            categoryBreakdown,
            monthlyComparison
        };
    }
};

window.MockStore = MockStore;
