package com.solarsense.service;

import com.solarsense.domain.Property;

import java.time.LocalDate;

public class GrantEligibilityService {
    private static final LocalDate SEAI_CUTOFF_DATE = LocalDate.of(2021, 1, 1);

    public boolean isEligibleForSeaiGrant(Property property) {
        if (property.isNewBuild()) {
            return false;
        }
        return property.getGridConnectionDate().isBefore(SEAI_CUTOFF_DATE);
    }
}
