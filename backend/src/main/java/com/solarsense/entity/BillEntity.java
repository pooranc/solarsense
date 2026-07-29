package com.solarsense.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "bills")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double dayRatePerKwh;
    private double nightRatePerKwh;
    private double peakRatePerKwh;
    private double standingChargePerDay;
    private double dayUnitsKwh;
    private double nightUnitsKwh;
    private double peakUnitsKwh;
    private int billPeriodDays;
}
