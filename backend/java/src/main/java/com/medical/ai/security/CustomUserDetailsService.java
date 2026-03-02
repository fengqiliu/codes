package com.medical.ai.security;

import com.medical.ai.entity.SysUser;
import com.medical.ai.repository.SysUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * 自定义UserDetailsService实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final SysUserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser user = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> {
                    log.warn("User not found: {}", username);
                    return new UsernameNotFoundException("用户不存在: " + username);
                });
        
        // TODO: 从数据库加载用户角色
        List<String> roles = loadUserRoles(user.getId());
        
        log.debug("Loaded user: {}, roles: {}", username, roles);
        
        return CustomUserDetails.fromSysUser(user, roles);
    }
    
    /**
     * 根据用户ID加载角色
     */
    private List<String> loadUserRoles(Long userId) {
        // TODO: 实现从数据库查询用户角色
        // 临时返回默认角色
        return Arrays.asList("USER");
    }
    
    /**
     * 根据用户ID加载UserDetails
     */
    public UserDetails loadUserById(Long userId) {
        SysUser user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + userId));
        
        List<String> roles = loadUserRoles(userId);
        
        return CustomUserDetails.fromSysUser(user, roles);
    }
}
