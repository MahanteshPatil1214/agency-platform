package com.navam.app.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ServiceType {
    WEB_DEVELOPMENT("Web Development"),
    APP_DEVELOPMENT("App Development"),
    DIGITAL_MARKETING("Digital Marketing"),
    SEO_OPTIMIZATION("SEO Optimization"),
    UI_UX_DESIGN("UI/UX Design");

    private final String displayName;

    ServiceType(String displayName) {
        this.displayName = displayName;
    }

    // This tells Jackson to send "Web Development" to the frontend (Output)
    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    // This tells Jackson how to convert "Web Development" from the frontend back to the Enum (Input)
    @JsonCreator
    public static ServiceType fromString(String text) {
        for (ServiceType b : ServiceType.values()) {
            // Checks for "Web Development" OR "WEB_DEVELOPMENT" (case-insensitive)
            if (b.displayName.equalsIgnoreCase(text) || b.name().equalsIgnoreCase(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Unknown service type: " + text);
    }
}