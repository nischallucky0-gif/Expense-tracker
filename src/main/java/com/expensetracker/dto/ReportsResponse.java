package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReportsResponse {
    private String periodLabel;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private double savingsRate;
    private List<CategorySpendingDTO> categoryBreakdown;
    private List<MonthlyComparisonDTO> monthlyTrends;
    private ExpenseResponse highestExpense;
    private ExpenseResponse lowestExpense;
    private long totalExpenseCount;
    private BigDecimal averageExpenseAmount;

    public ReportsResponse() {
    }

    public String getPeriodLabel() {
        return periodLabel;
    }

    public void setPeriodLabel(String periodLabel) {
        this.periodLabel = periodLabel;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }

    public double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public List<CategorySpendingDTO> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategorySpendingDTO> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<MonthlyComparisonDTO> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyComparisonDTO> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public ExpenseResponse getHighestExpense() {
        return highestExpense;
    }

    public void setHighestExpense(ExpenseResponse highestExpense) {
        this.highestExpense = highestExpense;
    }

    public ExpenseResponse getLowestExpense() {
        return lowestExpense;
    }

    public void setLowestExpense(ExpenseResponse lowestExpense) {
        this.lowestExpense = lowestExpense;
    }

    public long getTotalExpenseCount() {
        return totalExpenseCount;
    }

    public void setTotalExpenseCount(long totalExpenseCount) {
        this.totalExpenseCount = totalExpenseCount;
    }

    public BigDecimal getAverageExpenseAmount() {
        return averageExpenseAmount;
    }

    public void setAverageExpenseAmount(BigDecimal averageExpenseAmount) {
        this.averageExpenseAmount = averageExpenseAmount;
    }
}
