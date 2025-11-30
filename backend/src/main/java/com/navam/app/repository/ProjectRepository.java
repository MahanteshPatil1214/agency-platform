package com.navam.app.repository;

import com.navam.app.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByClientId(String clientId);

    long countByClientIdAndStatus(String clientId, String status);
}
