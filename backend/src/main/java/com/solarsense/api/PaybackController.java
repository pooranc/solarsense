package com.solarsense.api;

import com.solarsense.domain.Bill;
import com.solarsense.domain.Quote;
import com.solarsense.service.PaybackCalculationService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payback")
public class PaybackController {

    private final PaybackCalculationService paybackCalculationService;

    public PaybackController(PaybackCalculationService paybackCalculationService) {
        this.paybackCalculationService = paybackCalculationService;
    }

    @PostMapping("/calculate")
    public PaybackResponse calculate(@RequestBody PaybackRequest request) {
        Quote quote = new Quote(
                request.installerName(),
                request.systemSizeKwp(),
                request.numberOfPanels(),
                request.batteryCapacityKwh(),
                request.totalPrice(),
                request.grantAmountClaimed()
        );

        Bill bill = new Bill(
                request.dayRatePerKwh(),
                request.nightRatePerKwh(),
                request.peakRatePerKwh(),
                request.standingChargePerDay(),
                request.dayUnitsKwh(),
                request.nightUnitsKwh(),
                request.peakUnitsKwh(),
                request.billPeriodDays()
        );

        return new PaybackResponse(
                paybackCalculationService.conservativePayback(quote, bill),
                paybackCalculationService.moderatePayback(quote, bill),
                paybackCalculationService.optimisticPayback(quote, bill)
        );
    }

    record PaybackRequest(
            String installerName,
            double systemSizeKwp,
            int numberOfPanels,
            double batteryCapacityKwh,
            double totalPrice,
            double grantAmountClaimed,
            double dayRatePerKwh,
            double nightRatePerKwh,
            double peakRatePerKwh,
            double standingChargePerDay,
            double dayUnitsKwh,
            double nightUnitsKwh,
            double peakUnitsKwh,
            int billPeriodDays
    ) {}

    record PaybackResponse(
            double conservativeYears,
            double moderateYears,
            double optimisticYears
    ) {}
}
