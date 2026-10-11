package com.expensetracker.service;

import com.expensetracker.dto.IncomeRequest;
import com.expensetracker.dto.IncomeResponse;
import com.expensetracker.entity.Income;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.IncomeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Service
@Transactional
public class IncomeService {

    public static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "Salary", "Freelance", "Business", "Investments", "Other"
    );

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    @Transactional(readOnly = true)
    public Page<IncomeResponse> getIncomeList(String category, LocalDate startDate, LocalDate endDate, String search, Pageable pageable) {
        return incomeRepository.searchAndFilter(category, startDate, endDate, search, pageable)
                .map(IncomeResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public IncomeResponse getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        return IncomeResponse.fromEntity(income);
    }

    public IncomeResponse createIncome(IncomeRequest request) {
        validateIncomeRequest(request);

        Income income = new Income();
        populateEntity(income, request);

        Income saved = incomeRepository.save(income);
        return IncomeResponse.fromEntity(saved);
    }

    public IncomeResponse updateIncome(Long id, IncomeRequest request) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));

        validateIncomeRequest(request);
        populateEntity(income, request);

        Income updated = incomeRepository.save(income);
        return IncomeResponse.fromEntity(updated);
    }

    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Income not found with id: " + id);
        }
        incomeRepository.deleteById(id);
    }

    private void validateIncomeRequest(IncomeRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Income amount must be strictly greater than zero");
        }

        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw new BadRequestException("Income category is required");
        }

        String matchedCategory = ALLOWED_CATEGORIES.stream()
                .filter(c -> c.equalsIgnoreCase(request.getCategory().trim()))
                .findFirst()
                .orElse(null);

        if (matchedCategory == null) {
            throw new BadRequestException("Invalid income category. Allowed categories are: " +
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

    private void populateEntity(Income income, IncomeRequest request) {
        income.setAmount(request.getAmount());

        String canonicalCategory = ALLOWED_CATEGORIES.stream()
                .filter(c -> c.equalsIgnoreCase(request.getCategory().trim()))
                .findFirst()
                .orElse(request.getCategory().trim());
        income.setCategory(canonicalCategory);

        income.setDescription(request.getDescription().trim());
        income.setTransactionDate(request.getTransactionDate());
        income.setPaymentMethod(request.getPaymentMethod().trim());
        income.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
    }
}
