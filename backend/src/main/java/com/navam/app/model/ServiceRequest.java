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
    private String clientId; // Optional: ID of the registered user
    private String projectId; // Optional: ID of the existing project
    private String projectName; // For NEW_PROJECT requests
    private String priority; // For PROJECT_UPDATE (Low, Medium, High)
    private String phoneNumber;
    private String budgetRange;
    private String timeline;
    private String referenceLinks;
    private String requestType; // NEW_CLIENT, NEW_PROJECT, PROJECT_UPDATE
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
}
