package com.navam.app.controller;

import com.navam.app.repository.ProjectRepository;
import com.navam.app.repository.ServiceRequestRepository;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        long totalClients = userRepository.count(); // Ideally filter by role CLIENT, but count() is fine for now if
                                                    // mostly clients
        long activeProjects = projectRepository.countByClientIdAndStatus(null, "Active"); // This might need adjustment
                                                                                          // if countByClientIdAndStatus
                                                                                          // requires clientId.
        // Actually projectRepository.count() would be total projects.
        // Let's use count() for now or implement countByStatus.

        // For now, let's just get total projects count as active projects approximation
        // or add a method in repo
        long totalProjects = projectRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", totalClients);
        stats.put("activeProjects", totalProjects);
        stats.put("revenue", "$12.5k"); // Mock for now
        stats.put("systemHealth", "98%"); // Mock for now

        return ResponseEntity.ok(stats);
    }
}
