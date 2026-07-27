package com.solarsense;

import com.solarsense.domain.Bill;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
public class BillTest {

    @Test
    void billStoresTariffAndUsage() {
        Bill bill = new Bill(0.43, 0.22, 0.51, 0.75, 1200.0, 800.0, 200.0, 90);

        assertEquals(0.43, bill.getDayRatePerKwh());
        assertEquals(0.22, bill.getNightRatePerKwh());
        assertEquals(0.51, bill.getPeakRatePerKwh());
        assertEquals(0.75, bill.getStandingChargePerDay());
        assertEquals(1200.0, bill.getDayUnitsKwh());
        assertEquals(800.0, bill.getNightUnitsKwh());
        assertEquals(200.0, bill.getPeakUnitsKwh());
        assertEquals(90, bill.getBillPeriodDays());
    }
}
