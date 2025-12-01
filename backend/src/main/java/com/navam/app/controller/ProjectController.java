package com.navam.app.controller;

import com.navam.app.model.Project;
import com.navam.app.repository.ProjectRepository;
import com.navam.app.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/my-projects")
    @PreAuthorize("hasRole('CLIENT')")
    public List<Project> getMyProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return projectRepository.findByClientId(userDetails.getId());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getClientStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String clientId = userDetails.getId();

        long activeProjects = projectRepository.countByClientIdAndStatus(clientId, "Active");
        long completedProjects = projectRepository.countByClientIdAndStatus(clientId, "Completed");
        long pendingTasks = projectRepository.countByClientIdAndStatus(clientId, "Pending"); // Assuming pending
                                                                                             // projects count as tasks
                                                                                             // for now

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeProjects", activeProjects);
        stats.put("completedProjects", completedProjects);
        stats.put("pendingTasks", pendingTasks);
        stats.put("needsReview", 0); // Placeholder

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        if (project.getTasks() == null) {
            project.setTasks(new java.util.ArrayList<>());
        }
        if (project.getPriority() == null) {
            project.setPriority("Medium");
        }
        projectRepository.save(project);
        return ResponseEntity.ok("Project created successfully!");
    }

    @PostMapping("/{projectId}/tasks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addTask(@PathVariable String projectId,
            @RequestBody com.navam.app.model.ProjectTask task) {
        return projectRepository.findById(projectId).map(project -> {
            if (project.getTasks() == null) {
                project.setTasks(new java.util.ArrayList<>());
            }
            task.setId(java.util.UUID.randomUUID().toString());
            project.getTasks().add(task);
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
            return ResponseEntity.ok(project);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{projectId}/tasks/{taskId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<?> updateTask(@PathVariable String projectId, @PathVariable String taskId,
            @RequestBody com.navam.app.model.ProjectTask taskUpdate) {
        return projectRepository.findById(projectId).map(project -> {
            boolean found = false;
            if (project.getTasks() != null) {
                for (com.navam.app.model.ProjectTask task : project.getTasks()) {
                    if (task.getId().equals(taskId)) {
                        task.setStatus(taskUpdate.getStatus());
                        task.setCompleted(taskUpdate.isCompleted());
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                project.setUpdatedAt(LocalDateTime.now());
                projectRepository.save(project);
                return ResponseEntity.ok(project);
            } else {
                return ResponseEntity.notFound().build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<?> getProjectById(@PathVariable String id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
