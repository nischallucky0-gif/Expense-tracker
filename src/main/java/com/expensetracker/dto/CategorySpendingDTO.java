package com.expensetracker.dto;

import java.math.BigDecimal;

public class CategorySpendingDTO {
    private String category;
    private BigDecimal amount;
    private double percentage;

    public CategorySpendingDTO() {
    }

    public CategorySpendingDTO(String category, BigDecimal amount, double percentage) {
        this.category = category;
        this.amount = amount;
        this.percentage = percentage;
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

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
