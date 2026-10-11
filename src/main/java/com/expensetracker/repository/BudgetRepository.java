package com.expensetracker.repository;

import com.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByYearAndMonth(Integer year, Integer month);

    Optional<Budget> findByYearAndMonthAndCategory(Integer year, Integer month, String category);

    boolean existsByYearAndMonthAndCategory(Integer year, Integer month, String category);
}
