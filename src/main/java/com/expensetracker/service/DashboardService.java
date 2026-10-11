package com.expensetracker.service;

import com.expensetracker.dto.CategorySpendingDTO;
import com.expensetracker.dto.DashboardSummaryResponse;
import com.expensetracker.dto.MonthlyComparisonDTO;
import com.expensetracker.dto.TransactionItemDTO;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;

    public DashboardService(ExpenseRepository expenseRepository,
                            IncomeRepository incomeRepository,
                            BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.budgetRepository = budgetRepository;
    }

    public DashboardSummaryResponse getDashboardSummary(Integer year, Integer month) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        int targetMonth = (month != null) ? month : LocalDate.now().getMonthValue();

        YearMonth targetYm = YearMonth.of(targetYear, targetMonth);
        LocalDate startOfMonth = targetYm.atDay(1);
        LocalDate endOfMonth = targetYm.atEndOfMonth();

        // 1. Calculate Monthly Totals
        BigDecimal totalExpenses = expenseRepository.sumAmountBetween(startOfMonth, endOfMonth);
        BigDecimal totalIncome = incomeRepository.sumAmountBetween(startOfMonth, endOfMonth);
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        // 2. Monthly Budget Calculation
        Optional<Budget> overallBudgetOpt = budgetRepository.findByYearAndMonthAndCategory(targetYear, targetMonth, "OVERALL");
        BigDecimal monthlyBudget = overallBudgetOpt.map(Budget::getAmount).orElse(BigDecimal.ZERO);
        BigDecimal remainingBudget = BigDecimal.ZERO;
        double budgetUsedPercent = 0.0;
        boolean budgetWarning = false;
        boolean budgetExceeded = false;

        if (monthlyBudget.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = monthlyBudget.subtract(totalExpenses);
            remainingBudget = diff.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : diff;
            budgetUsedPercent = totalExpenses
                    .divide(monthlyBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            budgetUsedPercent = Math.round(budgetUsedPercent * 100.0) / 100.0;
            budgetWarning = budgetUsedPercent >= 80.0 && budgetUsedPercent <= 100.0;
            budgetExceeded = budgetUsedPercent > 100.0;
        }

        // 3. Category Breakdown for Doughnut Chart
        List<Object[]> categoryData = expenseRepository.findCategoryBreakdownBetween(startOfMonth, endOfMonth);
        List<CategorySpendingDTO> categoryBreakdown = new ArrayList<>();
        String highestCategoryName = "None";
        BigDecimal highestCategoryAmount = BigDecimal.ZERO;

        for (Object[] row : categoryData) {
            String cat = (String) row[0];
            BigDecimal amt = (BigDecimal) row[1];
            double pct = 0.0;
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                pct = amt.divide(totalExpenses, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
                pct = Math.round(pct * 10.0) / 10.0;
            }
            categoryBreakdown.add(new CategorySpendingDTO(cat, amt, pct));
        }

        if (!categoryBreakdown.isEmpty()) {
            highestCategoryName = categoryBreakdown.get(0).getCategory();
            highestCategoryAmount = categoryBreakdown.get(0).getAmount();
        }

        // 4. Monthly Trend History for last 6 months
        List<MonthlyComparisonDTO> monthlyTrends = buildMonthlyTrends(targetYm, 6);

        // 5. Recent Combined Transactions
        List<TransactionItemDTO> recentTransactions = buildRecentTransactions();

        // Assemble Summary DTO
        DashboardSummaryResponse res = new DashboardSummaryResponse();
        res.setYear(targetYear);
        res.setMonth(targetMonth);
        res.setTotalBalance(balance);
        res.setTotalIncome(totalIncome);
        res.setTotalExpenses(totalExpenses);
        res.setMonthlyBudget(monthlyBudget);
        res.setRemainingBudget(remainingBudget);
        res.setBudgetUsedPercentage(budgetUsedPercent);
        res.setBudgetWarning(budgetWarning);
        res.setBudgetExceeded(budgetExceeded);
        res.setHighestCategoryName(highestCategoryName);
        res.setHighestCategoryAmount(highestCategoryAmount);
        res.setCategoryBreakdown(categoryBreakdown);
        res.setMonthlyTrends(monthlyTrends);
        res.setRecentTransactions(recentTransactions);

        return res;
    }

    public List<CategorySpendingDTO> getCategoryBreakdown(Integer year, Integer month) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        int targetMonth = (month != null) ? month : LocalDate.now().getMonthValue();
        YearMonth targetYm = YearMonth.of(targetYear, targetMonth);

        LocalDate startOfMonth = targetYm.atDay(1);
        LocalDate endOfMonth = targetYm.atEndOfMonth();

        BigDecimal totalExpenses = expenseRepository.sumAmountBetween(startOfMonth, endOfMonth);
        List<Object[]> raw = expenseRepository.findCategoryBreakdownBetween(startOfMonth, endOfMonth);

        List<CategorySpendingDTO> list = new ArrayList<>();
        for (Object[] row : raw) {
            String cat = (String) row[0];
            BigDecimal amt = (BigDecimal) row[1];
            double pct = 0.0;
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                pct = amt.divide(totalExpenses, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
                pct = Math.round(pct * 10.0) / 10.0;
            }
            list.add(new CategorySpendingDTO(cat, amt, pct));
        }
        return list;
    }

    public List<MonthlyComparisonDTO> buildMonthlyTrends(YearMonth currentYm, int count) {
        List<MonthlyComparisonDTO> list = new ArrayList<>();
        for (int i = count - 1; i >= 0; i--) {
            YearMonth ym = currentYm.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal inc = incomeRepository.sumAmountBetween(start, end);
            BigDecimal exp = expenseRepository.sumAmountBetween(start, end);
            BigDecimal net = inc.subtract(exp);

            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + ym.getYear();
            list.add(new MonthlyComparisonDTO(label, ym.getYear(), ym.getMonthValue(), inc, exp, net));
        }
        return list;
    }

    private List<TransactionItemDTO> buildRecentTransactions() {
        List<Expense> expenses = expenseRepository.findTop5ByOrderByTransactionDateDescCreatedAtDesc();
        List<Income> incomes = incomeRepository.findTop5ByOrderByTransactionDateDescCreatedAtDesc();

        List<TransactionItemDTO> combined = new ArrayList<>();
        for (Expense e : expenses) {
            combined.add(new TransactionItemDTO(
                    e.getId(), "EXPENSE", e.getAmount(), e.getCategory(),
                    e.getDescription(), e.getTransactionDate(), e.getPaymentMethod()
            ));
        }
        for (Income i : incomes) {
            combined.add(new TransactionItemDTO(
                    i.getId(), "INCOME", i.getAmount(), i.getCategory(),
                    i.getDescription(), i.getTransactionDate(), i.getPaymentMethod()
            ));
        }

        // Sort descending by date
        combined.sort((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()));

        // Return up to 8 most recent
        return combined.stream().limit(8).collect(Collectors.toList());
    }
}
