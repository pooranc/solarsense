package com.solarsense.repository;

import com.solarsense.entity.BillEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository <BillEntity, Long> {
}
