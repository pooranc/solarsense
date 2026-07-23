package com.solarsense;

import com.solarsense.domain.Property;
import com.solarsense.service.GrantEligibilityService;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class GrantEligibilityServiceTest {

    private final GrantEligibilityService service = new GrantEligibilityService();

    @Test
    void oldHomeIsEligible() {
        Property property = new Property(LocalDate.of(2015, 6, 1), false);
        assertTrue(service.isEligibleForSeaiGrant(property));
    }

    @Test
    void newBuildIsNotEligible() {
        Property property = new Property(LocalDate.of(2015, 6, 1), true);
        assertFalse(service.isEligibleForSeaiGrant(property));
    }

    @Test
    void homeConnectedAfterCutoffIsNotEligible() {
        Property property = new Property(LocalDate.of(2025, 3, 1), false);
        assertFalse(service.isEligibleForSeaiGrant(property));
    }

    @Test
    void homeConnectedOnCutoffDateIsNotEligible() {
        Property property = new Property(LocalDate.of(2021, 1, 1), false);
        assertFalse(service.isEligibleForSeaiGrant(property));
    }
}
