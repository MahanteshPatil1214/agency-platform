package com.navam.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectTask {
    private String id;
    private String title;
    private String status; // "Pending", "In Progress", "Completed"
    private String assignee; // "Client" or "Admin"
    private LocalDateTime dueDate;
    private boolean completed;
}
