package com.solarsense.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class Property {

    private LocalDate gridConnectionDate;
    private boolean isNewBuild;

}
