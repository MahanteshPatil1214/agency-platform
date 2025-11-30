package com.navam.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String companyName;
    private Set<String> roles;

    public User(String username, String email, String password, String fullName, String companyName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.companyName = companyName;
    }
}
