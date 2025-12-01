package com.navam.app.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    private String companyName;

    private Set<String> roles;
}
