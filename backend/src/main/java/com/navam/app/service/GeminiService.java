package com.navam.app.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    // CHANGED: Added "-001" to target the specific stable version
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public List<String> generateTasks(String projectDescription) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construct the prompt
        String promptText = "Generate a list of 5-10 specific, actionable technical tasks for a software project with the following description: \""
                + projectDescription + "\". " +
                "Return ONLY the tasks as a JSON array of strings (e.g., [\"Task 1\", \"Task 2\"]). Do not include any markdown formatting or explanation.";

        Map<String, Object> content = new HashMap<>();
        Map<String, String> parts = new HashMap<>();
        parts.put("text", promptText);
        content.put("parts", new Object[] { parts });

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[] { content });

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            // Log URL for debugging (Optional)
            // System.out.println("Requesting Gemini URL: " + GEMINI_API_URL);

            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + "?key=" + apiKey, request,
                    Map.class);

            if (response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentPart = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentPart.get("parts");
                    if (partsList != null && !partsList.isEmpty()) {
                        String text = (String) partsList.get(0).get("text");
                        return parseTasksFromText(text);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback tasks if AI fails
            List<String> fallback = new ArrayList<>();
            fallback.add("Define project requirements");
            fallback.add("Set up development environment");
            fallback.add("Design database schema");
            return fallback;
        }

        return new ArrayList<>();
    }

    public String analyzeProject(String projectDetails) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String promptText = "Analyze the following project status and provide a brief health report (Status, Risks, Next Steps). "
                +
                "Keep it professional and concise. Project Details: " + projectDetails;

        Map<String, Object> content = new HashMap<>();
        Map<String, String> parts = new HashMap<>();
        parts.put("text", promptText);
        content.put("parts", new Object[] { parts });

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[] { content });

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + "?key=" + apiKey, request,
                    Map.class);
            if (response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentPart = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentPart.get("parts");
                    if (partsList != null && !partsList.isEmpty()) {
                        return (String) partsList.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to analyze project: " + e.getMessage();
        }
        return "No analysis generated.";
    }

    private List<String> parseTasksFromText(String text) {
        List<String> tasks = new ArrayList<>();
        try {
            // Clean up markdown if the AI includes it
            text = text.replace("```json", "").replace("```", "").trim();

            ObjectMapper mapper = new ObjectMapper();
            tasks = mapper.readValue(text, new TypeReference<List<String>>() {
            });

        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + text);
            tasks.add("Error parsing AI response.");
        }
        return tasks;
    }
}