package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    public static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "Food", "Transportation", "Shopping", "Bills", "Healthcare",
            "Education", "Entertainment", "Housing", "Travel", "Other"
    );

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> getExpenses(String category, LocalDate startDate, LocalDate endDate, String search, Pageable pageable) {
        return expenseRepository.searchAndFilter(category, startDate, endDate, search, pageable)
                .map(ExpenseResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return ExpenseResponse.fromEntity(expense);
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        validateExpenseRequest(request);

        Expense expense = new Expense();
        populateEntity(expense, request);

        Expense saved = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(saved);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        validateExpenseRequest(request);
        populateEntity(expense, request);

        Expense updated = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(updated);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    private void validateExpenseRequest(ExpenseRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Expense amount must be strictly greater than zero");
        }

        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw new BadRequestException("Expense category is required");
        }

        String matchedCategory = ALLOWED_CATEGORIES.stream()
                .filter(c -> c.equalsIgnoreCase(request.getCategory().trim()))
                .findFirst()
                .orElse(null);

        if (matchedCategory == null) {
            throw new BadRequestException("Invalid expense category. Allowed categories are: " +
                    String.join(", ", ALLOWED_CATEGORIES));
        }

        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new BadRequestException("Description is required");
        }

        if (request.getTransactionDate() == null) {
            throw new BadRequestException("Transaction date is required");
        }

        if (request.getPaymentMethod() == null || request.getPaymentMethod().trim().isEmpty()) {
            throw new BadRequestException("Payment method is required");
        }
    }

    private void populateEntity(Expense expense, ExpenseRequest request) {
        expense.setAmount(request.getAmount());

        // Canonicalize category casing
        String canonicalCategory = ALLOWED_CATEGORIES.stream()
                .filter(c -> c.equalsIgnoreCase(request.getCategory().trim()))
                .findFirst()
                .orElse(request.getCategory().trim());
        expense.setCategory(canonicalCategory);

        expense.setDescription(request.getDescription().trim());
        expense.setTransactionDate(request.getTransactionDate());
        expense.setPaymentMethod(request.getPaymentMethod().trim());
        expense.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
    }
}
