package com.navam.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "service_requests")
public class ServiceRequest {
    @Id
    private String id;
    private String fullName;
    private String email;
    private String companyName;
    private String serviceType;
    private String description;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
}
