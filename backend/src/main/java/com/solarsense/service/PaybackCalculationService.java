package com.solarsense.service;

import com.solarsense.domain.Bill;
import com.solarsense.domain.Quote;
import org.springframework.stereotype.Service;

@Service
public class PaybackCalculationService {

    private static final double IRELAND_SUN_HOURS = 900.0;
    private static final double CEG_RATE = 0.24;

    private static final double CONSERVATIVE_SELF_CONSUMPTION = 0.30;
    private static final double MODERATE_SELF_CONSUMPTION = 0.50;
    private static final double OPTIMISTIC_SELF_CONSUMPTION = 0.70;

    public double annualProductionKwh(Quote quote) {
        return quote.getSystemSizeKwp() * IRELAND_SUN_HOURS;
    }

    public double annualSavings(Quote quote, Bill bill, double selfConsumptionRate) {
        double production = annualProductionKwh(quote);
        double selfConsumed = production * selfConsumptionRate;
        double exported = production * (1 - selfConsumptionRate);

        double selfConsumptionSavings = selfConsumed * bill.getDayRatePerKwh();
        double exportIncome = exported * CEG_RATE;

        return selfConsumptionSavings + exportIncome;
    }

    public double paybackYears(Quote quote, Bill bill, double selfConsumptionRate) {
        double netCost = quote.getTotalPrice() - quote.getGrantAmountClaimed();
        double savings = annualSavings(quote, bill, selfConsumptionRate);
        return netCost / savings;
    }

    public double conservativePayback(Quote quote, Bill bill) {
        return paybackYears(quote, bill, CONSERVATIVE_SELF_CONSUMPTION);
    }

    public double moderatePayback(Quote quote, Bill bill) {
        return paybackYears(quote, bill, MODERATE_SELF_CONSUMPTION);
    }

    public double optimisticPayback(Quote quote, Bill bill) {
        return paybackYears(quote, bill, OPTIMISTIC_SELF_CONSUMPTION);
    }

}
