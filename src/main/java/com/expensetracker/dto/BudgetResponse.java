package com.expensetracker.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

public class BudgetResponse {
    private Long id;
    private Integer year;
    private Integer month;
    private String category;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private double percentageUsed;
    private boolean warning;
    private boolean exceeded;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BudgetResponse() {
    }

    public static BudgetResponse of(Long id, Integer year, Integer month, String category,
                                     BigDecimal budgetAmount, BigDecimal spentAmount,
                                     LocalDateTime createdAt, LocalDateTime updatedAt) {
        BudgetResponse res = new BudgetResponse();
        res.setId(id);
        res.setYear(year);
        res.setMonth(month);
        res.setCategory(category);
        res.setAmount(budgetAmount != null ? budgetAmount : BigDecimal.ZERO);
        res.setSpentAmount(spentAmount != null ? spentAmount : BigDecimal.ZERO);

        BigDecimal remaining = res.getAmount().subtract(res.getSpentAmount());
        res.setRemainingAmount(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);

        if (res.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            double percent = res.getSpentAmount()
                    .divide(res.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            res.setPercentageUsed(Math.round(percent * 100.0) / 100.0);
        } else {
            res.setPercentageUsed(0.0);
        }

        res.setWarning(res.getPercentageUsed() >= 80.0 && res.getPercentageUsed() <= 100.0);
        res.setExceeded(res.getPercentageUsed() > 100.0);
        res.setCreatedAt(createdAt);
        res.setUpdatedAt(updatedAt);
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getPercentageUsed() {
        return percentageUsed;
    }

    public void setPercentageUsed(double percentageUsed) {
        this.percentageUsed = percentageUsed;
    }

    public boolean isWarning() {
        return warning;
    }

    public void setWarning(boolean warning) {
        this.warning = warning;
    }

    public boolean isExceeded() {
        return exceeded;
    }

    public void setExceeded(boolean exceeded) {
        this.exceeded = exceeded;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
