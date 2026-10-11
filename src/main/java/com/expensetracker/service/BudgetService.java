package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(Integer year, Integer month) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        int targetMonth = (month != null) ? month : LocalDate.now().getMonthValue();

        List<Budget> budgets = budgetRepository.findByYearAndMonth(targetYear, targetMonth);
        return budgets.stream()
                .map(this::mapToBudgetResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        return mapToBudgetResponse(budget);
    }

    public BudgetResponse createOrUpdateBudget(BudgetRequest request) {
        validateBudgetRequest(request);

        String category = normalizeCategory(request.getCategory());

        Optional<Budget> existing = budgetRepository.findByYearAndMonthAndCategory(
                request.getYear(), request.getMonth(), category);

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAmount(request.getAmount());
        } else {
            budget = new Budget(request.getYear(), request.getMonth(), category, request.getAmount());
        }

        Budget saved = budgetRepository.save(budget);
        return mapToBudgetResponse(saved);
    }

    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        validateBudgetRequest(request);
        String category = normalizeCategory(request.getCategory());

        // Check if updating creates a duplicate key
        Optional<Budget> duplicate = budgetRepository.findByYearAndMonthAndCategory(
                request.getYear(), request.getMonth(), category);
        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new BadRequestException("A budget for year " + request.getYear() + ", month " +
                    request.getMonth() + " and category '" + category + "' already exists");
        }

        budget.setYear(request.getYear());
        budget.setMonth(request.getMonth());
        budget.setCategory(category);
        budget.setAmount(request.getAmount());

        Budget updated = budgetRepository.save(budget);
        return mapToBudgetResponse(updated);
    }

    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget not found with id: " + id);
        }
        budgetRepository.deleteById(id);
    }

    public BudgetResponse mapToBudgetResponse(Budget budget) {
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal spent;
        if ("OVERALL".equalsIgnoreCase(budget.getCategory())) {
            spent = expenseRepository.sumAmountBetween(startDate, endDate);
        } else {
            spent = expenseRepository.sumCategoryAmountBetween(budget.getCategory(), startDate, endDate);
        }

        return BudgetResponse.of(
                budget.getId(),
                budget.getYear(),
                budget.getMonth(),
                budget.getCategory(),
                budget.getAmount(),
                spent,
                budget.getCreatedAt(),
                budget.getUpdatedAt()
        );
    }

    private String normalizeCategory(String category) {
        if (category == null || category.trim().isEmpty() || "ALL".equalsIgnoreCase(category.trim())) {
            return "OVERALL";
        }
        return category.trim();
    }

    private void validateBudgetRequest(BudgetRequest request) {
        if (request.getYear() == null || request.getYear() < 2000 || request.getYear() > 2100) {
            throw new BadRequestException("Valid year (2000 - 2100) is required");
        }
        if (request.getMonth() == null || request.getMonth() < 1 || request.getMonth() > 12) {
            throw new BadRequestException("Valid month (1 - 12) is required");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Budget amount must be strictly greater than zero");
        }

        String cat = normalizeCategory(request.getCategory());
        if (!"OVERALL".equalsIgnoreCase(cat) && !ExpenseService.ALLOWED_CATEGORIES.contains(cat)) {
            throw new BadRequestException("Category must be 'OVERALL' or one of: " +
                    String.join(", ", ExpenseService.ALLOWED_CATEGORIES));
        }
    }
}
