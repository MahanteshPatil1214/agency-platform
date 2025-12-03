package com.navam.app.controller;

import com.navam.app.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate-tasks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateTasks(@RequestBody Map<String, String> payload) {
        String description = payload.get("description");
        if (description == null || description.isEmpty()) {
            return ResponseEntity.badRequest().body("Project description is required");
        }

        List<String> tasks = geminiService.generateTasks(description);
        return ResponseEntity.ok(tasks);
    }
}
