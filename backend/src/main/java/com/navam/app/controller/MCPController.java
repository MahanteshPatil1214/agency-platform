package com.navam.app.controller;

import com.navam.app.model.Project;
import com.navam.app.model.ProjectTask;
import com.navam.app.repository.ProjectRepository;
import com.navam.app.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.navam.app.security.UserDetailsImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/mcp")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MCPController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GeminiService geminiService;

    // 1. List Available Tools
    @GetMapping("/tools")
    public ResponseEntity<List<Map<String, Object>>> listTools() {
        List<Map<String, Object>> tools = new ArrayList<>();

        // Tool: list_projects
        Map<String, Object> listProjectsTool = new HashMap<>();
        listProjectsTool.put("name", "list_projects");
        listProjectsTool.put("description", "List all active projects in the system.");
        listProjectsTool.put("parameters", new HashMap<>()); // No params
        tools.add(listProjectsTool);

        // Tool: analyze_project
        Map<String, Object> analyzeProjectTool = new HashMap<>();
        analyzeProjectTool.put("name", "analyze_project");
        analyzeProjectTool.put("description", "Analyze a specific project using AI to get a health report.");
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");
        Map<String, Object> props = new HashMap<>();
        props.put("projectId", Map.of("type", "string", "description", "The ID of the project to analyze"));
        params.put("properties", props);
        params.put("required", List.of("projectId"));
        analyzeProjectTool.put("parameters", params);
        tools.add(analyzeProjectTool);

        // Tool: create_task
        Map<String, Object> createTaskTool = new HashMap<>();
        createTaskTool.put("name", "create_task");
        createTaskTool.put("description", "Add a new task to a specific project.");
        Map<String, Object> taskParams = new HashMap<>();
        taskParams.put("type", "object");
        Map<String, Object> taskProps = new HashMap<>();
        taskProps.put("projectId", Map.of("type", "string", "description", "The ID of the project"));
        taskProps.put("taskDescription", Map.of("type", "string", "description", "The description of the task to add"));
        taskParams.put("properties", taskProps);
        taskParams.put("required", List.of("projectId", "taskDescription"));
        createTaskTool.put("parameters", taskParams);
        tools.add(createTaskTool);

        // Tool: update_project_status
        Map<String, Object> updateStatusTool = new HashMap<>();
        updateStatusTool.put("name", "update_project_status");
        updateStatusTool.put("description", "Update the status of a project.");
        Map<String, Object> statusParams = new HashMap<>();
        statusParams.put("type", "object");
        Map<String, Object> statusProps = new HashMap<>();
        statusProps.put("projectId", Map.of("type", "string", "description", "The ID of the project"));
        statusProps.put("status",
                Map.of("type", "string", "description", "The new status (e.g., 'In Progress', 'Completed')"));
        statusParams.put("properties", statusProps);
        statusParams.put("required", List.of("projectId", "status"));
        updateStatusTool.put("parameters", statusParams);
        tools.add(updateStatusTool);

        return ResponseEntity.ok(tools);
    }

    // 2. Call a Tool
    @PostMapping("/call")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<?> callTool(@RequestBody Map<String, Object> request) {
        String toolName = (String) request.get("name");
        Map<String, Object> args = (Map<String, Object>) request.get("arguments");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        String currentUserId = userDetails.getId();

        if ("list_projects".equals(toolName)) {
            List<Project> projects;
            if (isAdmin) {
                projects = projectRepository.findAll();
            } else {
                projects = projectRepository.findByClientId(currentUserId);
            }
            return ResponseEntity.ok(projects);
        } else if ("analyze_project".equals(toolName)) {
            if (args == null || !args.containsKey("projectId")) {
                return ResponseEntity.badRequest().body("Missing projectId argument");
            }
            String projectId = (String) args.get("projectId");
            Optional<Project> projectOpt = projectRepository.findById(projectId);

            if (projectOpt.isPresent()) {
                Project project = projectOpt.get();

                // Security check for clients
                if (!isAdmin && !project.getClientId().equals(currentUserId)) {
                    return ResponseEntity.status(403).body("Access denied to this project");
                }

                String details = "Name: " + project.getName() +
                        ", Status: " + project.getStatus() +
                        ", Description: " + project.getDescription() +
                        ", Tasks: " + (project.getTasks() != null ? project.getTasks().size() : 0);

                String analysis = geminiService.analyzeProject(details);
                return ResponseEntity.ok(Map.of("analysis", analysis));
            } else {
                return ResponseEntity.status(404).body("Project not found");
            }
        } else if ("create_task".equals(toolName)) {
            if (args == null || !args.containsKey("projectId") || !args.containsKey("taskDescription")) {
                return ResponseEntity.badRequest().body("Missing projectId or taskDescription argument");
            }
            String projectId = (String) args.get("projectId");
            String taskDescription = (String) args.get("taskDescription");

            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (projectOpt.isPresent()) {
                Project project = projectOpt.get();
                if (!isAdmin && !project.getClientId().equals(currentUserId)) {
                    return ResponseEntity.status(403).body("Access denied to this project");
                }

                List<ProjectTask> tasks = project.getTasks();
                if (tasks == null) {
                    tasks = new ArrayList<>();
                }

                ProjectTask newTask = new ProjectTask();
                newTask.setId(UUID.randomUUID().toString());
                newTask.setTitle(taskDescription);
                newTask.setStatus("Pending");
                newTask.setAssignee("Admin");
                newTask.setCompleted(false);
                newTask.setDueDate(java.time.LocalDateTime.now().plusDays(7));

                tasks.add(newTask);
                project.setTasks(tasks);
                projectRepository.save(project);

                return ResponseEntity.ok(Map.of("message", "Task added successfully", "task", newTask));
            } else {
                return ResponseEntity.status(404).body("Project not found");
            }
        } else if ("update_project_status".equals(toolName)) {
            if (args == null || !args.containsKey("projectId") || !args.containsKey("status")) {
                return ResponseEntity.badRequest().body("Missing projectId or status argument");
            }
            String projectId = (String) args.get("projectId");
            String status = (String) args.get("status");

            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (projectOpt.isPresent()) {
                Project project = projectOpt.get();
                if (!isAdmin && !project.getClientId().equals(currentUserId)) {
                    return ResponseEntity.status(403).body("Access denied to this project");
                }

                project.setStatus(status);
                projectRepository.save(project);

                return ResponseEntity.ok(Map.of("message", "Project status updated successfully", "status", status));
            } else {
                return ResponseEntity.status(404).body("Project not found");
            }
        }

        return ResponseEntity.badRequest().body("Unknown tool: " + toolName);
    }
}
