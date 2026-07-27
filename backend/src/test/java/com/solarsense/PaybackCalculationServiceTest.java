package com.solarsense;

import com.solarsense.domain.Bill;
import com.solarsense.domain.Quote;
import com.solarsense.service.PaybackCalculationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PaybackCalculationServiceTest {

    private final PaybackCalculationService service = new PaybackCalculationService();

    private final Quote quote = new Quote("SolarCo", 6.0, 12, 10.0, 15000.0, 2400.0);
    private final Bill bill = new Bill(0.43, 0.22, 0.51, 0.75, 1200.0, 800.0, 200.0, 90);

    @Test
    void annualProductionIsCorrect() {
        assertEquals(5400.0, service.annualProductionKwh(quote), 0.01);
    }

    @Test
    void conservativePaybackIsCorrect() {
        // net cost = 15000 - 2400 = 12600
        // self consumed = 5400 * 0.30 = 1620 kWh * 0.43 = 696.60
        // exported = 5400 * 0.70 = 3780 kWh * 0.24 = 907.20
        // annual savings = 1603.80
        // payback = 12600 / 1603.80 = 7.86 years
        assertEquals(7.86, service.conservativePayback(quote, bill), 0.01);
    }

    @Test
    void moderatePaybackIsCorrect() {
        assertEquals(6.97, service.moderatePayback(quote, bill), 0.01);
    }

    @Test
    void optimisticPaybackIsCorrect() {
        assertEquals(6.26, service.optimisticPayback(quote, bill), 0.01);
    }
}
