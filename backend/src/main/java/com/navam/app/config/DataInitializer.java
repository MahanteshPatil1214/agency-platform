package com.navam.app.config;

import com.navam.app.model.User;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

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
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("Admin roles updated.");
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
            System.out.println("Default Admin User created.");
            System.out.println("Username: " + adminUsername);
            System.out.println("Password: " + adminPassword);
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
            System.out.println("Test Client created.");
        }
    }
}
