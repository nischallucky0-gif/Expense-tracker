package com.expensetracker.service;

import com.expensetracker.dto.CategorySpendingDTO;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.MonthlyComparisonDTO;
import com.expensetracker.dto.ReportsResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public ReportService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public ReportsResponse generateReport(LocalDate startDate, LocalDate endDate, String category) {
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusMonths(6).withDayOfMonth(1);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

        BigDecimal totalExpenses = expenseRepository.sumAmountBetween(start, end);
        BigDecimal totalIncome = incomeRepository.sumAmountBetween(start, end);
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);

        double savingsRate = 0.0;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netSavings.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            savingsRate = Math.round(savingsRate * 100.0) / 100.0;
        }

        // Category breakdown
        List<Object[]> categoryData = expenseRepository.findCategoryBreakdownBetween(start, end);
        List<CategorySpendingDTO> categoryBreakdown = new ArrayList<>();
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

        // Monthly trends across the selected range
        List<MonthlyComparisonDTO> monthlyTrends = buildTrendsBetween(start, end);

        // Highest and Lowest expenses in period
        List<Expense> highestList = expenseRepository.findHighestExpensesBetween(start, end, PageRequest.of(0, 1));
        List<Expense> lowestList = expenseRepository.findLowestExpensesBetween(start, end, PageRequest.of(0, 1));

        ExpenseResponse highest = highestList.isEmpty() ? null : ExpenseResponse.fromEntity(highestList.get(0));
        ExpenseResponse lowest = lowestList.isEmpty() ? null : ExpenseResponse.fromEntity(lowestList.get(0));

        // Assemble report
        ReportsResponse report = new ReportsResponse();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        report.setPeriodLabel(start.format(dtf) + " - " + end.format(dtf));
        report.setTotalIncome(totalIncome);
        report.setTotalExpenses(totalExpenses);
        report.setNetSavings(netSavings);
        report.setSavingsRate(savingsRate);
        report.setCategoryBreakdown(categoryBreakdown);
        report.setMonthlyTrends(monthlyTrends);
        report.setHighestExpense(highest);
        report.setLowestExpense(lowest);

        return report;
    }

    public List<MonthlyComparisonDTO> getMonthlyReports(Integer monthsBack) {
        int count = (monthsBack != null && monthsBack > 0) ? monthsBack : 12;
        YearMonth current = YearMonth.now();
        List<MonthlyComparisonDTO> list = new ArrayList<>();

        for (int i = count - 1; i >= 0; i--) {
            YearMonth ym = current.minusMonths(i);
            LocalDate s = ym.atDay(1);
            LocalDate e = ym.atEndOfMonth();

            BigDecimal inc = incomeRepository.sumAmountBetween(s, e);
            BigDecimal exp = expenseRepository.sumAmountBetween(s, e);
            BigDecimal net = inc.subtract(exp);

            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + ym.getYear();
            list.add(new MonthlyComparisonDTO(label, ym.getYear(), ym.getMonthValue(), inc, exp, net));
        }
        return list;
    }

    private List<MonthlyComparisonDTO> buildTrendsBetween(LocalDate start, LocalDate end) {
        YearMonth startYm = YearMonth.from(start);
        YearMonth endYm = YearMonth.from(end);
        List<MonthlyComparisonDTO> trends = new ArrayList<>();

        YearMonth cur = startYm;
        while (!cur.isAfter(endYm)) {
            LocalDate s = cur.atDay(1);
            LocalDate e = cur.atEndOfMonth();

            BigDecimal inc = incomeRepository.sumAmountBetween(s, e);
            BigDecimal exp = expenseRepository.sumAmountBetween(s, e);
            BigDecimal net = inc.subtract(exp);

            String label = cur.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + cur.getYear();
            trends.add(new MonthlyComparisonDTO(label, cur.getYear(), cur.getMonthValue(), inc, exp, net));

            cur = cur.plusMonths(1);
        }

        return trends;
    }
}
