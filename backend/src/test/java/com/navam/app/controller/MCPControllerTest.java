package com.navam.app.controller;

import com.navam.app.model.Project;
import com.navam.app.model.ProjectTask;
import com.navam.app.repository.ProjectRepository;
import com.navam.app.service.GeminiService;
import com.navam.app.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MCPControllerTest {

    @InjectMocks
    private MCPController mcpController;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private GeminiService geminiService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
    }

    private void mockUser(String userId, String role) {
        UserDetailsImpl userDetails = new UserDetailsImpl(userId, "testuser", "test@example.com", "Test User",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority(role)));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
    }

    @Test
    void testListTools() {
        ResponseEntity<List<Map<String, Object>>> response = mcpController.listTools();
        assertEquals(200, response.getStatusCodeValue());
        List<Map<String, Object>> tools = response.getBody();
        assertNotNull(tools);
        assertTrue(tools.stream().anyMatch(t -> t.get("name").equals("list_projects")));
        assertTrue(tools.stream().anyMatch(t -> t.get("name").equals("analyze_project")));
        assertTrue(tools.stream().anyMatch(t -> t.get("name").equals("create_task")));
        assertTrue(tools.stream().anyMatch(t -> t.get("name").equals("update_project_status")));
    }

    @Test
    void testCallCreateTask_Admin() {
        mockUser("admin1", "ROLE_ADMIN");
        String projectId = "proj1";
        String taskDesc = "New Task";

        Project project = new Project();
        project.setId(projectId);
        project.setTasks(new ArrayList<>());
        project.setClientId("client1"); // Ensure client ID is set for security check

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Map<String, Object> request = new HashMap<>();
        request.put("name", "create_task");
        Map<String, Object> args = new HashMap<>();
        args.put("projectId", projectId);
        args.put("taskDescription", taskDesc);
        request.put("arguments", args);

        ResponseEntity<?> response = mcpController.callTool(request);
        assertEquals(200, response.getStatusCodeValue());

        verify(projectRepository, times(1)).save(project);
        // We can't easily verify the task was added to the list because we are mocking
        // save,
        // but we can verify the response contains the task.
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody.get("task"));
    }

    @Test
    void testCallUpdateProjectStatus_Client_Owner() {
        String clientId = "client1";
        mockUser(clientId, "ROLE_CLIENT");
        String projectId = "proj1";
        String newStatus = "Completed";

        Project project = new Project();
        project.setId(projectId);
        project.setClientId(clientId);
        project.setStatus("In Progress");

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Map<String, Object> request = new HashMap<>();
        request.put("name", "update_project_status");
        Map<String, Object> args = new HashMap<>();
        args.put("projectId", projectId);
        args.put("status", newStatus);
        request.put("arguments", args);

        ResponseEntity<?> response = mcpController.callTool(request);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(newStatus, project.getStatus());
    }

    @Test
    void testCallUpdateProjectStatus_Client_NotOwner() {
        mockUser("client1", "ROLE_CLIENT");
        String projectId = "proj1";

        Project project = new Project();
        project.setId(projectId);
        project.setClientId("otherClient"); // Different owner

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        Map<String, Object> request = new HashMap<>();
        request.put("name", "update_project_status");
        Map<String, Object> args = new HashMap<>();
        args.put("projectId", projectId);
        args.put("status", "Completed");
        request.put("arguments", args);

        ResponseEntity<?> response = mcpController.callTool(request);
        assertEquals(403, response.getStatusCodeValue());
    }
}
