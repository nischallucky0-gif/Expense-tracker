package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTransactionDateBetweenOrderByTransactionDateDesc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT e FROM Expense e WHERE " +
           "(:category IS NULL OR :category = '' OR e.category = :category) AND " +
           "(:startDate IS NULL OR e.transactionDate >= :startDate) AND " +
           "(:endDate IS NULL OR e.transactionDate <= :endDate) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Expense> searchAndFilter(
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.category = :category AND e.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumCategoryAmountBetween(
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT e.category, SUM(e.amount) as total FROM Expense e WHERE e.transactionDate BETWEEN :startDate AND :endDate GROUP BY e.category ORDER BY total DESC")
    List<Object[]> findCategoryBreakdownBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Expense> findTop5ByOrderByTransactionDateDescCreatedAtDesc();

    @Query("SELECT e FROM Expense e WHERE e.transactionDate BETWEEN :startDate AND :endDate ORDER BY e.amount DESC")
    List<Expense> findHighestExpensesBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);

    @Query("SELECT e FROM Expense e WHERE e.transactionDate BETWEEN :startDate AND :endDate ORDER BY e.amount ASC")
    List<Expense> findLowestExpensesBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);
}
