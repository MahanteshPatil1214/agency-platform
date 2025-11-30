package com.navam.app.security;

import com.navam.app.model.User;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Attempting to load user by username or email: " + username);
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    System.out.println("User not found by username: " + username + ". Attempting to find by email.");
                    return userRepository.findByEmail(username)
                            .orElseThrow(() -> {
                                System.out.println("User not found by username or email: " + username);
                                return new UsernameNotFoundException(
                                        "User Not Found with username or email: " + username);
                            });
                });
        System.out.println("User found: " + user.getUsername() + ", Roles: " + user.getRoles());
        return UserDetailsImpl.build(user);
    }
}
