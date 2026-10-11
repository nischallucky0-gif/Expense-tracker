package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.CategorySpendingDTO;
import com.expensetracker.dto.DashboardSummaryResponse;
import com.expensetracker.dto.MonthlyComparisonDTO;
import com.expensetracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(year, month);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<MonthlyComparisonDTO>>> getMonthlyTrends(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "6") int count
    ) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        int targetMonth = (month != null) ? month : LocalDate.now().getMonthValue();
        YearMonth targetYm = YearMonth.of(targetYear, targetMonth);

        List<MonthlyComparisonDTO> trends = dashboardService.buildMonthlyTrends(targetYm, count);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategorySpendingDTO>>> getCategoryBreakdown(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        List<CategorySpendingDTO> breakdown = dashboardService.getCategoryBreakdown(year, month);
        return ResponseEntity.ok(ApiResponse.success(breakdown));
    }
}
