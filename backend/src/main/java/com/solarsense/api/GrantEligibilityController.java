package com.solarsense.api;

import com.solarsense.domain.Property;
import com.solarsense.service.GrantEligibilityService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/grant-eligibility")
public class GrantEligibilityController {

    private final GrantEligibilityService grantEligibilityService;

    public GrantEligibilityController(GrantEligibilityService grantEligibilityService) {
        this.grantEligibilityService = grantEligibilityService;
    }

    @PostMapping("/check")
    public EligibilityResponse check(@RequestBody EligibilityRequest request) {
        Property property = new Property(request.gridConnectionDate(), request.isNewBuild());
        boolean eligible = grantEligibilityService.isEligibleForSeaiGrant(property);
        return new EligibilityResponse(eligible);
    }

    record EligibilityRequest(LocalDate gridConnectionDate, boolean isNewBuild) {
    }

    record EligibilityResponse(boolean eligible) {
    }
}
