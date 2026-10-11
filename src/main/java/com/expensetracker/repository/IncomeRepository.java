package com.expensetracker.repository;

import com.expensetracker.entity.Income;
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
public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByTransactionDateBetweenOrderByTransactionDateDesc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT i FROM Income i WHERE " +
           "(:category IS NULL OR :category = '' OR i.category = :category) AND " +
           "(:startDate IS NULL OR i.transactionDate >= :startDate) AND " +
           "(:endDate IS NULL OR i.transactionDate <= :endDate) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Income> searchAndFilter(
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i")
    BigDecimal sumTotalAmount();

    @Query("SELECT i.category, SUM(i.amount) as total FROM Income i WHERE i.transactionDate BETWEEN :startDate AND :endDate GROUP BY i.category ORDER BY total DESC")
    List<Object[]> findCategoryBreakdownBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Income> findTop5ByOrderByTransactionDateDescCreatedAtDesc();
}
