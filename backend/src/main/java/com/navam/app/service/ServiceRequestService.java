package com.navam.app.service;

import com.navam.app.exception.ResourceNotFoundException;
import com.navam.app.model.ServiceRequest;
import com.navam.app.model.enums.RequestStatus;
import com.navam.app.repository.ServiceRequestRepository;
import com.navam.app.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public ServiceRequest submitRequest(ServiceRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // If user is authenticated, link to client
        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getPrincipal().equals("anonymousUser")) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            request.setClientId(userDetails.getId());

            // Auto-populate user details if missing
            if (request.getFullName() == null || request.getFullName().isEmpty()) {
                request.setFullName(userDetails.getFullName());
            }
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                request.setEmail(userDetails.getEmail());
            }

            // If it's a client, it must be NEW_PROJECT or PROJECT_UPDATE
            if (request.getRequestType() == null) {
                request.setRequestType("NEW_PROJECT"); // Default for client if not specified
            }
        } else {
            // If unauthenticated, it MUST be a NEW_CLIENT request
            request.setRequestType("NEW_CLIENT");
            request.setClientId(null);
            request.setProjectId(null);
        }

        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        return serviceRequestRepository.save(request);
    }

    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    public List<ServiceRequest> getMyRequests(String clientId) {
        return serviceRequestRepository.findByClientId(clientId);
    }

    public ServiceRequest updateStatus(String id, RequestStatus status) {
        return serviceRequestRepository.findById(id)
                .map(request -> {
                    request.setStatus(status);
                    return serviceRequestRepository.save(request);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with id: " + id));
    }
}
