package com.solarsense.domain;

import java.time.LocalDate;

public class Property {

    private LocalDate gridConnectionDate;
    private boolean isNewBuild;

    public Property(LocalDate gridConnectionDate, boolean isNewBuild) {
        this.gridConnectionDate = gridConnectionDate;
        this.isNewBuild = isNewBuild;
    }

    public LocalDate getGridConnectionDate() {
        return gridConnectionDate;
    }

    public boolean isNewBuild() {
        return isNewBuild;
    }
}
