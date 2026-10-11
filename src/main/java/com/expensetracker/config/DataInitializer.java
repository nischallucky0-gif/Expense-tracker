package com.expensetracker.config;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;

    @Value("${app.seed-sample-data:true}")
    private boolean seedData;

    public DataInitializer(ExpenseRepository expenseRepository,
                           IncomeRepository incomeRepository,
                           BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public void run(String... args) {
        if (!seedData) {
            log.info("Sample data seeding is disabled via app.seed-sample-data=false");
            return;
        }

        long expenseCount = expenseRepository.count();
        long incomeCount = incomeRepository.count();

        if (expenseCount > 0 || incomeCount > 0) {
            log.info("Database already contains data ({} expenses, {} incomes). Skipping seed.", expenseCount, incomeCount);
            return;
        }

        log.info("Seeding initial realistic financial records...");

        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth lastMonth = currentMonth.minusMonths(1);
        YearMonth twoMonthsAgo = currentMonth.minusMonths(2);

        // 1. Seed Budgets for current month (in Rupees)
        budgetRepository.save(new Budget(currentMonth.getYear(), currentMonth.getMonthValue(), "OVERALL", new BigDecimal("60000.00")));
        budgetRepository.save(new Budget(currentMonth.getYear(), currentMonth.getMonthValue(), "Food", new BigDecimal("12000.00")));
        budgetRepository.save(new Budget(currentMonth.getYear(), currentMonth.getMonthValue(), "Transportation", new BigDecimal("5000.00")));
        budgetRepository.save(new Budget(currentMonth.getYear(), currentMonth.getMonthValue(), "Entertainment", new BigDecimal("4000.00")));
        budgetRepository.save(new Budget(currentMonth.getYear(), currentMonth.getMonthValue(), "Shopping", new BigDecimal("8000.00")));

        // 2. Seed Incomes (Current month & past 2 months, in Rupees)
        incomeRepository.saveAll(List.of(
                // Current Month
                new Income(new BigDecimal("85000.00"), "Salary", "Monthly Tech Corp Salary", currentMonth.atDay(1), "Bank Transfer", "Direct deposit regular payroll"),
                new Income(new BigDecimal("15000.00"), "Freelance", "Mobile App UI Design Project", currentMonth.atDay(8), "Bank Transfer", "Client invoice #104"),
                new Income(new BigDecimal("3500.00"), "Investments", "Quarterly Mutual Fund Dividend", currentMonth.atDay(12), "Bank Transfer", "Index fund dividend distribution"),

                // Last Month
                new Income(new BigDecimal("85000.00"), "Salary", "Monthly Tech Corp Salary", lastMonth.atDay(1), "Bank Transfer", "Direct deposit regular payroll"),
                new Income(new BigDecimal("20000.00"), "Freelance", "Backend API Consulting", lastMonth.atDay(15), "Bank Transfer", "Consulting contract"),

                // Two Months Ago
                new Income(new BigDecimal("80000.00"), "Salary", "Monthly Tech Corp Salary", twoMonthsAgo.atDay(1), "Bank Transfer", "Direct deposit regular payroll"),
                new Income(new BigDecimal("6000.00"), "Business", "E-commerce Affiliate Income", twoMonthsAgo.atDay(20), "Bank Transfer", "Monthly affiliate commission")
        ));

        // 3. Seed Expenses for current month (in Rupees)
        expenseRepository.saveAll(List.of(
                new Expense(new BigDecimal("22000.00"), "Housing", "Apartment Monthly Rent", currentMonth.atDay(2), "Bank Transfer", "Primary residence lease payment"),
                new Expense(new BigDecimal("3200.00"), "Bills", "High-speed Internet & Electricity", currentMonth.atDay(4), "Credit Card", "Utility bills autopay"),
                new Expense(new BigDecimal("4500.00"), "Food", "Supermarket Monthly Groceries", currentMonth.atDay(5), "UPI", "Fresh produce, dairy and pantry staples"),
                new Expense(new BigDecimal("1200.00"), "Transportation", "Metro Commuter Card Reload", currentMonth.atDay(6), "UPI", "Monthly commuter card"),
                new Expense(new BigDecimal("2499.00"), "Shopping", "Ergonomic Desk Accessories", currentMonth.atDay(7), "Credit Card", "Wireless keyboard & wrist rest"),
                new Expense(new BigDecimal("1850.00"), "Food", "Dinner with Friends at Restaurant", currentMonth.atDay(9), "Credit Card", "Friday team celebration"),
                new Expense(new BigDecimal("650.00"), "Healthcare", "Prescription & Vitamins", currentMonth.atDay(10), "Cash", "Neighborhood pharmacy"),
                new Expense(new BigDecimal("999.00"), "Entertainment", "Video & Music Streaming Plans", currentMonth.atDay(11), "Credit Card", "Netflix & Spotify subscriptions"),
                new Expense(new BigDecimal("2100.00"), "Food", "Midweek Grocery & Snacks", currentMonth.atDay(12), "UPI", "Groceries and fruits"),
                new Expense(new BigDecimal("2500.00"), "Transportation", "Fuel & Vehicle Service", currentMonth.atDay(13), "UPI", "Fuel station"),

                // Past month expenses
                new Expense(new BigDecimal("22000.00"), "Housing", "Apartment Monthly Rent", lastMonth.atDay(2), "Bank Transfer", "Lease payment"),
                new Expense(new BigDecimal("9500.00"), "Food", "Monthly Groceries & Dining", lastMonth.atDay(14), "Credit Card", "Aggregated groceries"),
                new Expense(new BigDecimal("3400.00"), "Bills", "Electric & Water Utilities", lastMonth.atDay(18), "Bank Transfer", "Monthly utilities"),
                new Expense(new BigDecimal("2800.00"), "Transportation", "Fuel & Cab Rides", lastMonth.atDay(22), "Credit Card", "Travel & commute"),
                new Expense(new BigDecimal("3200.00"), "Entertainment", "Concert Tickets & Movies", lastMonth.atDay(25), "Credit Card", "Weekend outing"),

                // Two months ago expenses
                new Expense(new BigDecimal("22000.00"), "Housing", "Apartment Monthly Rent", twoMonthsAgo.atDay(2), "Bank Transfer", "Lease payment"),
                new Expense(new BigDecimal("8800.00"), "Food", "Monthly Food Supplies", twoMonthsAgo.atDay(12), "UPI", "Groceries"),
                new Expense(new BigDecimal("5500.00"), "Travel", "Weekend Hill Station Getaway", twoMonthsAgo.atDay(19), "Credit Card", "Resort stay & travel")
        ));

        log.info("Database successfully seeded with realistic sample financial transactions and budgets!");
    }
}
