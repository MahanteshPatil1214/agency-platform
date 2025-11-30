package com.navam.app.repository;

import com.navam.app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    java.util.List<User> findByRolesContaining(String role);

    Optional<User> findByEmail(String email);
}
