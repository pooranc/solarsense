package com.solarsense.service;

import com.solarsense.domain.Bill;
import org.springframework.stereotype.Service;

@Service
public class BillCalculationService {

    public double annualDayUnitsKwh(Bill bill) {
        return (bill.getDayUnitsKwh() / bill.getBillPeriodDays()) * 365;
    }

    public double annualNightUnitsKwh(Bill bill) {
        return (bill.getNightUnitsKwh() / bill.getBillPeriodDays()) * 365;
    }

    public double annualPeakUnitsKwh(Bill bill) {
        return (bill.getPeakUnitsKwh() / bill.getBillPeriodDays()) * 365;
    }

    public double totalAnnualKwh(Bill bill) {
        return annualDayUnitsKwh(bill) + annualNightUnitsKwh(bill) + annualPeakUnitsKwh(bill);
    }
}
