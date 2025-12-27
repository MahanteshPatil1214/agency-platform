package com.navam.app.security;

import com.navam.app.model.User;
import com.navam.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Attempting to load user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    logger.debug("User not found by username: {}. Attempting to find by email.", username);
                    return userRepository.findByEmail(username)
                            .orElseThrow(() -> {
                                logger.error("User not found by username or email: {}", username);
                                return new UsernameNotFoundException(
                                        "User Not Found with username or email: " + username);
                            });
                });
        return UserDetailsImpl.build(user);
    }
}
