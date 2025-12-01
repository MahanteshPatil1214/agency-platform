package com.navam.app.controller;

import com.navam.app.model.ServiceRequest;
import com.navam.app.model.enums.RequestStatus;
import com.navam.app.security.UserDetailsImpl;
import com.navam.app.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(@RequestBody ServiceRequest request) {
        serviceRequestService.submitRequest(request);
        return ResponseEntity.ok("Service request submitted successfully!");
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestService.getAllRequests();
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('CLIENT')")
    public List<ServiceRequest> getMyRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return serviceRequestService.getMyRequests(userDetails.getId());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        try {
            RequestStatus status = RequestStatus.valueOf(statusStr);
            serviceRequestService.updateStatus(id, status);
            return ResponseEntity.ok("Status updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }
    }
}
