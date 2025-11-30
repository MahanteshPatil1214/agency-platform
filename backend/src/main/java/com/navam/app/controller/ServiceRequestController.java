package com.navam.app.controller;

import com.navam.app.model.ServiceRequest;
import com.navam.app.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(@RequestBody ServiceRequest request) {
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        serviceRequestRepository.save(request);
        return ResponseEntity.ok("Service request submitted successfully!");
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        String status = payload.get("status");
        return serviceRequestRepository.findById(id)
                .map(request -> {
                    request.setStatus(status);
                    serviceRequestRepository.save(request);
                    return ResponseEntity.ok("Status updated successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
