package com.expensetracker.controller;

import com.expensetracker.dto.DashboardSummaryResponse;
import com.expensetracker.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @DisplayName("GET /api/dashboard/summary should return accurate balance and financial KPIs")
    void testGetSummary() throws Exception {
        DashboardSummaryResponse mockSummary = new DashboardSummaryResponse();
        mockSummary.setYear(2026);
        mockSummary.setMonth(4);
        mockSummary.setTotalIncome(new BigDecimal("5000.00"));
        mockSummary.setTotalExpenses(new BigDecimal("3200.00"));
        mockSummary.setTotalBalance(new BigDecimal("1800.00")); // 5000 - 3200
        mockSummary.setMonthlyBudget(new BigDecimal("4000.00"));
        mockSummary.setRemainingBudget(new BigDecimal("800.00"));
        mockSummary.setBudgetUsedPercentage(80.0);
        mockSummary.setBudgetWarning(true);
        mockSummary.setCategoryBreakdown(new ArrayList<>());
        mockSummary.setMonthlyTrends(new ArrayList<>());
        mockSummary.setRecentTransactions(new ArrayList<>());

        when(dashboardService.getDashboardSummary(anyInt(), anyInt())).thenReturn(mockSummary);

        mockMvc.perform(get("/api/dashboard/summary?year=2026&month=4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalIncome").value(5000.00))
                .andExpect(jsonPath("$.data.totalExpenses").value(3200.00))
                .andExpect(jsonPath("$.data.totalBalance").value(1800.00))
                .andExpect(jsonPath("$.data.budgetWarning").value(true));
    }
}
