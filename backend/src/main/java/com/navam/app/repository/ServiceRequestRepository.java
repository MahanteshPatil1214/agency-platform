package com.navam.app.repository;

import com.navam.app.model.ServiceRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServiceRequestRepository extends MongoRepository<ServiceRequest, String> {
    List<ServiceRequest> findByStatus(String status);

    List<ServiceRequest> findByClientId(String clientId);
}
