/**
 * SpendFlow - Analytics & Reports Module
 * Income vs. Expense breakdowns, savings rates, extremes, and CSV Export
 */

const ReportsModule = {
    comparisonChartInstance: null,
    categoryPieChartInstance: null,
    currentReportData: null,

    init() {
        this.setupEventListeners();
        this.setDefaultDates();
    },

    setDefaultDates() {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const startInput = document.getElementById('reportStartDate');
        const endInput = document.getElementById('reportEndDate');

        if (startInput) startInput.value = sixMonthsAgo.toISOString().split('T')[0];
        if (endInput) endInput.value = today.toISOString().split('T')[0];
    },

    setupEventListeners() {
        const generateBtn = document.getElementById('generateReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.loadData());
        }

        const exportBtn = document.getElementById('exportReportCsvBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCsv());
        }
    },

    async loadData() {
        const startInput = document.getElementById('reportStartDate');
        const endInput = document.getElementById('reportEndDate');

        const startDate = startInput ? startInput.value : '';
        const endDate = endInput ? endInput.value : '';

        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const res = await App.apiFetch(`/api/reports/analytics?${params.toString()}`);
            if (res && res.data) {
                this.currentReportData = res.data;
                this.renderReport(res.data);
            }
        } catch (error) {
            console.error('Failed to load report:', error);
            App.showToast('Failed to generate report: ' + error.message, 'error');
        }
    },

    renderReport(data) {
        // KPI Cards
        const incomeEl = document.getElementById('reportTotalIncome');
        const expenseEl = document.getElementById('reportTotalExpenses');
        const savingsEl = document.getElementById('reportNetSavings');
        const rateEl = document.getElementById('reportSavingsRate');
        const periodEl = document.getElementById('reportPeriodLabel');
        const highestEl = document.getElementById('reportHighestExpense');
        const lowestEl = document.getElementById('reportLowestExpense');

        if (incomeEl) incomeEl.textContent = App.formatCurrency(data.totalIncome);
        if (expenseEl) expenseEl.textContent = App.formatCurrency(data.totalExpenses);
        if (periodEl) periodEl.textContent = data.periodLabel || 'Selected Range';

        if (savingsEl) {
            const net = parseFloat(data.netSavings) || 0;
            savingsEl.textContent = App.formatCurrency(net);
            savingsEl.className = 'kpi-value ' + (net >= 0 ? 'text-emerald' : 'text-rose');
        }

        if (rateEl) {
            rateEl.textContent = `${data.savingsRate}% Savings Rate`;
        }

        if (highestEl) {
            if (data.highestExpense) {
                highestEl.textContent = `${App.formatCurrency(data.highestExpense.amount)} (${data.highestExpense.description})`;
            } else {
                highestEl.textContent = '₹0.00';
            }
        }

        if (lowestEl) {
            if (data.lowestExpense) {
                lowestEl.textContent = `${App.formatCurrency(data.lowestExpense.amount)} (${data.lowestExpense.description})`;
            } else {
                lowestEl.textContent = '₹0.00';
            }
        }

        // Render Charts
        this.renderComparisonChart(data.monthlyTrends || []);
        this.renderCategoryPie(data.categoryBreakdown || []);
    },

    renderComparisonChart(trends) {
        const canvas = document.getElementById('reportComparisonChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.comparisonChartInstance) {
            this.comparisonChartInstance.destroy();
        }

        const labels = trends.map(t => t.monthLabel);
        const incomeData = trends.map(t => parseFloat(t.income) || 0);
        const expenseData = trends.map(t => parseFloat(t.expense) || 0);
        const savingsData = trends.map(t => parseFloat(t.netSavings) || 0);

        this.comparisonChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        type: 'bar',
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: '#f43f5e',
                        borderRadius: 6
                    },
                    {
                        type: 'line',
                        label: 'Net Savings',
                        data: savingsData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: false,
                        tension: 0.3,
                        pointBackgroundColor: '#6366f1',
                        pointRadius: 4
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
                            label: function(ctx) {
                                return ` ${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
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
                            callback: function(v) { return '₹' + v.toLocaleString('en-IN'); }
                        }
                    }
                }
            }
        });
    },

    renderCategoryPie(breakdown) {
        const canvas = document.getElementById('reportCategoryPieChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.categoryPieChartInstance) {
            this.categoryPieChartInstance.destroy();
        }

        if (!breakdown || breakdown.length === 0) {
            this.categoryPieChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#e2e8f0']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
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

        this.categoryPieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: palette.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                return ` ${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                }
            }
        });
    },

    exportCsv() {
        if (!this.currentReportData) {
            App.showToast('Please generate a report first before exporting', 'warning');
            return;
        }

        const data = this.currentReportData;
        let csvContent = 'data:text/csv;charset=utf-8,';

        csvContent += `SpendFlow Financial Report\r\n`;
        csvContent += `Period:,"${data.periodLabel}"\r\n`;
        csvContent += `Total Income,${data.totalIncome}\r\n`;
        csvContent += `Total Expenses,${data.totalExpenses}\r\n`;
        csvContent += `Net Savings,${data.netSavings}\r\n`;
        csvContent += `Savings Rate,${data.savingsRate}%\r\n\r\n`;

        csvContent += `Monthly Trends Breakdown\r\n`;
        csvContent += `Month,Income,Expenses,Net Savings\r\n`;
        (data.monthlyTrends || []).forEach(t => {
            csvContent += `"${t.monthLabel}",${t.income},${t.expense},${t.netSavings}\r\n`;
        });

        csvContent += `\r\nCategory Breakdown\r\n`;
        csvContent += `Category,Amount,Percentage\r\n`;
        (data.categoryBreakdown || []).forEach(c => {
            csvContent += `"${c.category}",${c.amount},${c.percentage}%\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        App.showToast('Report CSV successfully downloaded!', 'success');
    }
};
