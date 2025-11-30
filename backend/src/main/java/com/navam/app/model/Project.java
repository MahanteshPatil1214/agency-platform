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
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private String status; // "Active", "Pending", "Completed"
    private String clientId; // User ID of the client
    private String update; // Latest update message
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
