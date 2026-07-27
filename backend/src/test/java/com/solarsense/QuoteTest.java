package com.solarsense;

import com.solarsense.domain.Quote;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class QuoteTest {

    @Test
    void quoteStoresInstallerDetails() {
        Quote quote = new Quote("SolarCo", 6.0, 12, 10.0, 15000.0, 2400.0);

        assertEquals("SolarCo", quote.getInstallerName());
        assertEquals(6.0, quote.getSystemSizeKwp());
        assertEquals(12, quote.getNumberOfPanels());
        assertEquals(10.0, quote.getBatteryCapacityKwh());
        assertEquals(15000.0, quote.getTotalPrice());
        assertEquals(2400.0, quote.getGrantAmountClaimed());
    }
}
