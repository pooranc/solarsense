package com.solarsense.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Bill {

    private double dayRatePerKwh;
    private double nightRatePerKwh;
    private double peakRatePerKwh;
    private double standingChargePerDay;
    private double dayUnitsKwh;
    private double nightUnitsKwh;
    private double peakUnitsKwh;
    private int billPeriodDays;
}
