package com.expensetracker.dto;

import java.math.BigDecimal;

public class MonthlyComparisonDTO {
    private String monthLabel;
    private int year;
    private int month;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal netSavings;

    public MonthlyComparisonDTO() {
    }

    public MonthlyComparisonDTO(String monthLabel, int year, int month, BigDecimal income, BigDecimal expense, BigDecimal netSavings) {
        this.monthLabel = monthLabel;
        this.year = year;
        this.month = month;
        this.income = income;
        this.expense = expense;
        this.netSavings = netSavings;
    }

    public String getMonthLabel() {
        return monthLabel;
    }

    public void setMonthLabel(String monthLabel) {
        this.monthLabel = monthLabel;
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

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }
}
