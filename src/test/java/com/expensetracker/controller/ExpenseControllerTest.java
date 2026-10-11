package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.exception.GlobalExceptionHandler;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class)
@Import(GlobalExceptionHandler.class)
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExpenseService expenseService;

    @Test
    @DisplayName("POST /api/expenses should return 201 Created on valid input")
    void testCreateExpense_Success() throws Exception {
        ExpenseRequest req = new ExpenseRequest();
        req.setAmount(new BigDecimal("75.00"));
        req.setCategory("Food");
        req.setDescription("Bistro Dinner");
        req.setTransactionDate(LocalDate.of(2026, 4, 11));
        req.setPaymentMethod("Credit Card");

        ExpenseResponse res = new ExpenseResponse();
        res.setId(10L);
        res.setAmount(new BigDecimal("75.00"));
        res.setCategory("Food");
        res.setDescription("Bistro Dinner");
        res.setTransactionDate(LocalDate.of(2026, 4, 11));
        res.setPaymentMethod("Credit Card");

        when(expenseService.createExpense(any(ExpenseRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.description").value("Bistro Dinner"));
    }

    @Test
    @DisplayName("POST /api/expenses should return 400 Bad Request on invalid input")
    void testCreateExpense_ValidationFailure() throws Exception {
        ExpenseRequest req = new ExpenseRequest();
        req.setAmount(new BigDecimal("-5.00")); // Invalid negative
        req.setDescription(""); // Blank description

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.validationErrors").exists());
    }

    @Test
    @DisplayName("GET /api/expenses/{id} should return 404 when expense is not found")
    void testGetExpenseById_NotFound() throws Exception {
        when(expenseService.getExpenseById(999L))
                .thenThrow(new ResourceNotFoundException("Expense not found with id: 999"));

        mockMvc.perform(get("/api/expenses/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Expense not found with id: 999"));
    }

    @Test
    @DisplayName("DELETE /api/expenses/{id} should return 200 OK")
    void testDeleteExpense_Success() throws Exception {
        doNothing().when(expenseService).deleteExpense(1L);

        mockMvc.perform(delete("/api/expenses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Expense deleted successfully"));

        verify(expenseService, times(1)).deleteExpense(1L);
    }
}
