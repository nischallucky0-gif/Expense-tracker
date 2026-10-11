package com.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionItemDTO {
    private Long id;
    private String type; // "EXPENSE" or "INCOME"
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate transactionDate;
    private String paymentMethod;

    public TransactionItemDTO() {
    }

    public TransactionItemDTO(Long id, String type, BigDecimal amount, String category, String description, LocalDate transactionDate, String paymentMethod) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.transactionDate = transactionDate;
        this.paymentMethod = paymentMethod;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
