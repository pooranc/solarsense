package com.solarsense.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quotes")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String installerName;
    private double systemSizeKwp;
    private int numberOfPanels;
    private double batteryCapacityKwh;
    private double totalPrice;
    private double grantAmountClaimed;
}
