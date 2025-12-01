package com.navam.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private String userId;

    public MessageResponse(String message) {
        this.message = message;
    }
}
