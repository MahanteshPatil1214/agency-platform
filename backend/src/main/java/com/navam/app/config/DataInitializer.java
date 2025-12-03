package com.navam.app.config;

import com.navam.app.model.User;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists by username OR email
        if (userRepository.existsByUsername(adminUsername) || userRepository.existsByEmail(adminEmail)) {
            // Update existing admin to ensure roles are correct
            // Try to find by username first, then email
            User admin = userRepository.findByUsername(adminUsername)
                    .orElseGet(() -> userRepository.findByEmail(adminEmail).orElseThrow());

            Set<String> roles = admin.getRoles();
            if (roles == null) {
                roles = new HashSet<>();
            }
            roles.add("ROLE_ADMIN");
            roles.add("ROLE_USER");
            admin.setPassword(passwordEncoder.encode(adminPassword)); // Always update password
            admin.setRoles(roles);
            userRepository.save(admin);
            logger.info("Admin roles and password updated.");
        } else {
            // Create new admin
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setFullName("System Admin");
            admin.setCompanyName("NAVAM");

            Set<String> roles = new HashSet<>();
            roles.add("ROLE_ADMIN");
            roles.add("ROLE_USER");
            admin.setRoles(roles);

            userRepository.save(admin);
            logger.info("Default Admin User created: {}", adminUsername);
        }

        // Seed a test client
        if (!userRepository.existsByUsername("testclient")) {
            User client = new User();
            client.setUsername("testclient");
            client.setEmail("client@test.com");
            client.setPassword(passwordEncoder.encode("password"));
            client.setFullName("Test Client");
            client.setCompanyName("Test Corp");

            Set<String> roles = new HashSet<>();
            roles.add("ROLE_CLIENT");
            client.setRoles(roles);

            userRepository.save(client);
            userRepository.save(client);
            logger.info("Test Client created: testclient");
        }
    }
}
