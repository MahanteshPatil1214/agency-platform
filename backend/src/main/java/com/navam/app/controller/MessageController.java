package com.navam.app.controller;

import com.navam.app.model.Message;
import com.navam.app.model.User;
import com.navam.app.repository.MessageRepository;
import com.navam.app.repository.UserRepository;
import com.navam.app.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    @PreAuthorize("hasRole('USER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        message.setSenderId(userDetails.getId());
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);

        System.out.println("Sending message from: " + message.getSenderId() + " to: " + message.getReceiverId()
                + " Subject: " + message.getSubject() + " Priority: " + message.getPriority()
                + " Content: " + message.getContent());

        messageRepository.save(message);
        return ResponseEntity.ok("Message sent successfully");
    }

    @GetMapping("/conversation/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public List<Message> getConversation(@PathVariable String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String currentUserId = userDetails.getId();

        System.out.println("Fetching conversation between: " + currentUserId + " and " + userId);

        List<Message> messages = messageRepository.findConversation(currentUserId, userId);
        System.out.println("Found " + messages.size() + " messages.");
        return messages;
    }

    @GetMapping("/contacts")
    @PreAuthorize("hasRole('USER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public List<User> getContacts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        if (roles.contains("ROLE_ADMIN")) {
            // Admin sees all clients
            return userRepository.findAll().stream()
                    .filter(user -> user.getRoles() != null &&
                            (user.getRoles().contains("ROLE_CLIENT") || user.getRoles().contains("client")))
                    .collect(Collectors.toList());
        } else {
            // Client sees Admins
            return userRepository.findAll().stream()
                    .filter(user -> user.getRoles() != null &&
                            (user.getRoles().contains("ROLE_ADMIN") || user.getRoles().contains("admin")))
                    .collect(Collectors.toList());
        }
    }
}
