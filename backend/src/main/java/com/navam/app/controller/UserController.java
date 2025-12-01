package com.navam.app.controller;

import com.navam.app.model.User;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

import com.navam.app.dto.ChangePasswordRequest;
import com.navam.app.dto.UpdateProfileRequest;
import com.navam.app.dto.MessageResponse;
import com.navam.app.security.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

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

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getEmail() != null) {
            user.setEmail(updateRequest.getEmail());
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/password")
    @PreAuthorize("hasRole('USER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest passwordRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (!encoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Current password is incorrect!"));
        }

        user.setPassword(encoder.encode(passwordRequest.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }
}
