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
        projectRepository.save(project);
        return ResponseEntity.ok("Project created successfully!");
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}
