package com.navam.app.controller;

import com.navam.app.model.Contact;
import com.navam.app.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/contact")
public class ContactController {
    @Autowired
    private ContactService contactService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitContact(@RequestBody Contact contact) {
        contactService.saveContact(contact);
        return ResponseEntity.ok("Message sent successfully!");
    }
}
