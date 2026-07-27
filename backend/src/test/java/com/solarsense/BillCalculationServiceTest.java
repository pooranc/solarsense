package com.solarsense;

import com.solarsense.domain.Bill;
import com.solarsense.service.BillCalculationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class BillCalculationServiceTest {

    private final BillCalculationService service = new BillCalculationService();

    private final Bill bill = new Bill(0.43, 0.22, 0.51, 0.75, 1200.0, 800.0, 200.0, 90);

    @Test
    void annualisesDAyUnitsCorrectly() {
        assertEquals(4866.67, service.annualDayUnitsKwh(bill), 0.01);
    }

    @Test
    void annualisesNightUnitsCorrectly() {
        assertEquals(3244.44, service.annualNightUnitsKwh(bill), 0.01);
    }

    @Test
    void annualisesPeakUnitsCorrectly() {
        assertEquals(811.11, service.annualPeakUnitsKwh(bill), 0.01);
    }

    @Test
    void totalAnnualKwhSumsAllThree() {
        assertEquals(8922.22, service.totalAnnualKwh(bill), 0.01);
    }
}
