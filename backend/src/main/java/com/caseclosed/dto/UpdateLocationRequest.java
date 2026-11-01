package com.caseclosed.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateLocationRequest {

    @NotBlank(message = "Location ID cannot be blank")
    private String locationId;

    public UpdateLocationRequest() {}

    public UpdateLocationRequest(String locationId) {
        this.locationId = locationId;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }
}
