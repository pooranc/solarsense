package com.solarsense.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Quote {
    private String installerName;
    private double systemSizeKwp;
    private int numberOfPanels;
    private double batteryCapacityKwh;
    private double totalPrice;
    private double grantAmountClaimed;
}
