package com.expensetracker.service;

import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private BudgetService budgetService;

    @Test
    @DisplayName("Should correctly calculate normal budget spending below warning threshold")
    void testMapToBudgetResponse_Normal() {
        Budget budget = new Budget(2026, 4, "OVERALL", new BigDecimal("1000.00"));
        budget.setId(1L);

        when(expenseRepository.sumAmountBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("500.00"));

        BudgetResponse response = budgetService.mapToBudgetResponse(budget);

        assertNotNull(response);
        assertEquals(new BigDecimal("1000.00"), response.getAmount());
        assertEquals(new BigDecimal("500.00"), response.getSpentAmount());
        assertEquals(new BigDecimal("500.00"), response.getRemainingAmount());
        assertEquals(50.0, response.getPercentageUsed());
        assertFalse(response.isWarning());
        assertFalse(response.isExceeded());
    }

    @Test
    @DisplayName("Should trigger warning flag when spending reaches 80% or higher")
    void testMapToBudgetResponse_WarningThreshold() {
        Budget budget = new Budget(2026, 4, "Food", new BigDecimal("500.00"));
        budget.setId(2L);

        when(expenseRepository.sumCategoryAmountBetween(any(String.class), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("420.00")); // 84%

        BudgetResponse response = budgetService.mapToBudgetResponse(budget);

        assertNotNull(response);
        assertEquals(84.0, response.getPercentageUsed());
        assertTrue(response.isWarning());
        assertFalse(response.isExceeded());
    }

    @Test
    @DisplayName("Should trigger exceeded flag when spending goes over 100%")
    void testMapToBudgetResponse_ExceededThreshold() {
        Budget budget = new Budget(2026, 4, "Entertainment", new BigDecimal("200.00"));
        budget.setId(3L);

        when(expenseRepository.sumCategoryAmountBetween(any(String.class), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("250.00")); // 125%

        BudgetResponse response = budgetService.mapToBudgetResponse(budget);

        assertNotNull(response);
        assertEquals(125.0, response.getPercentageUsed());
        assertFalse(response.isWarning());
        assertTrue(response.isExceeded());
        assertEquals(BigDecimal.ZERO, response.getRemainingAmount()); // Remaining should clamp at zero
    }
}
