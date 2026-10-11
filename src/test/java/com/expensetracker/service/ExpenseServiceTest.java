package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private ExpenseRequest validRequest;
    private Expense expenseEntity;

    @BeforeEach
    void setUp() {
        validRequest = new ExpenseRequest();
        validRequest.setAmount(new BigDecimal("120.50"));
        validRequest.setCategory("Food");
        validRequest.setDescription("Weekly Grocery");
        validRequest.setTransactionDate(LocalDate.of(2026, 4, 10));
        validRequest.setPaymentMethod("Credit Card");
        validRequest.setNotes("Supermarket run");

        expenseEntity = new Expense(
                new BigDecimal("120.50"),
                "Food",
                "Weekly Grocery",
                LocalDate.of(2026, 4, 10),
                "Credit Card",
                "Supermarket run"
        );
        expenseEntity.setId(1L);
    }

    @Test
    @DisplayName("Should create an expense successfully")
    void testCreateExpense_Success() {
        when(expenseRepository.save(any(Expense.class))).thenReturn(expenseEntity);

        ExpenseResponse response = expenseService.createExpense(validRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(new BigDecimal("120.50"), response.getAmount());
        assertEquals("Food", response.getCategory());
        assertEquals("Weekly Grocery", response.getDescription());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    @DisplayName("Should reject expense with zero or negative amount")
    void testCreateExpense_InvalidAmount() {
        validRequest.setAmount(new BigDecimal("-10.00"));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            expenseService.createExpense(validRequest);
        });

        assertTrue(ex.getMessage().contains("strictly greater than zero"));
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    @DisplayName("Should reject expense with invalid category")
    void testCreateExpense_InvalidCategory() {
        validRequest.setCategory("CryptoGambling");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            expenseService.createExpense(validRequest);
        });

        assertTrue(ex.getMessage().contains("Invalid expense category"));
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    @DisplayName("Should update an existing expense")
    void testUpdateExpense_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expenseEntity));
        when(expenseRepository.save(any(Expense.class))).thenReturn(expenseEntity);

        validRequest.setDescription("Updated Grocery Description");
        ExpenseResponse updated = expenseService.updateExpense(1L, validRequest);

        assertNotNull(updated);
        assertEquals(1L, updated.getId());
        verify(expenseRepository, times(1)).findById(1L);
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent expense")
    void testUpdateExpense_NotFound() {
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            expenseService.updateExpense(99L, validRequest);
        });

        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    @DisplayName("Should delete expense when it exists")
    void testDeleteExpense_Success() {
        when(expenseRepository.existsById(1L)).thenReturn(true);

        expenseService.deleteExpense(1L);

        verify(expenseRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent expense")
    void testDeleteExpense_NotFound() {
        when(expenseRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            expenseService.deleteExpense(99L);
        });

        verify(expenseRepository, never()).deleteById(anyLong());
    }
}
