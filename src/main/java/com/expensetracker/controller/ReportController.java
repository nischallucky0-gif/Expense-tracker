package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.CategorySpendingDTO;
import com.expensetracker.dto.MonthlyComparisonDTO;
import com.expensetracker.dto.ReportsResponse;
import com.expensetracker.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<ReportsResponse>> getAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category
    ) {
        ReportsResponse report = reportService.generateReport(startDate, endDate, category);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<MonthlyComparisonDTO>>> getMonthlyReport(
            @RequestParam(required = false, defaultValue = "12") Integer months
    ) {
        List<MonthlyComparisonDTO> trends = reportService.getMonthlyReports(months);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategorySpendingDTO>>> getCategoryBreakdown(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category
    ) {
        ReportsResponse report = reportService.generateReport(startDate, endDate, category);
        return ResponseEntity.ok(ApiResponse.success(report.getCategoryBreakdown()));
    }
}
