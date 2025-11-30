package com.navam.app.controller;

import com.navam.app.model.User;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/clients")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getClients() {
        // Fetch all users and filter for ROLE_CLIENT
        List<User> allUsers = userRepository.findAll();
        System.out.println("Total users found: " + allUsers.size());

        List<User> clients = allUsers.stream()
                .filter(user -> {
                    return user.getRoles() != null
                            && (user.getRoles().contains("ROLE_CLIENT") || user.getRoles().contains("client"));
                })
                .collect(Collectors.toList());

        System.out.println("Filtered clients count: " + clients.size());
        return clients;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
