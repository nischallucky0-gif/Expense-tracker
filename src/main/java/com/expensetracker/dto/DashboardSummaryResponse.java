package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {
    private int year;
    private int month;
    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal monthlyBudget;
    private BigDecimal remainingBudget;
    private double budgetUsedPercentage;
    private boolean budgetWarning;
    private boolean budgetExceeded;
    private String highestCategoryName;
    private BigDecimal highestCategoryAmount;
    private List<CategorySpendingDTO> categoryBreakdown;
    private List<MonthlyComparisonDTO> monthlyTrends;
    private List<TransactionItemDTO> recentTransactions;

    public DashboardSummaryResponse() {
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
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

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public double getBudgetUsedPercentage() {
        return budgetUsedPercentage;
    }

    public void setBudgetUsedPercentage(double budgetUsedPercentage) {
        this.budgetUsedPercentage = budgetUsedPercentage;
    }

    public boolean isBudgetWarning() {
        return budgetWarning;
    }

    public void setBudgetWarning(boolean budgetWarning) {
        this.budgetWarning = budgetWarning;
    }

    public boolean isBudgetExceeded() {
        return budgetExceeded;
    }

    public void setBudgetExceeded(boolean budgetExceeded) {
        this.budgetExceeded = budgetExceeded;
    }

    public String getHighestCategoryName() {
        return highestCategoryName;
    }

    public void setHighestCategoryName(String highestCategoryName) {
        this.highestCategoryName = highestCategoryName;
    }

    public BigDecimal getHighestCategoryAmount() {
        return highestCategoryAmount;
    }

    public void setHighestCategoryAmount(BigDecimal highestCategoryAmount) {
        this.highestCategoryAmount = highestCategoryAmount;
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

    public List<TransactionItemDTO> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionItemDTO> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
