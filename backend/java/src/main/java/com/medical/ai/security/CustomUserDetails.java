package com.medical.ai.security;

import com.medical.ai.entity.SysUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 自定义UserDetails实现
 */
@Data
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
    
    private Long id;
    private String username;
    private String password;
    private String email;
    private String realName;
    private Long tenantId;
    private Integer status;
    private List<String> roles;
    
    /**
     * 从SysUser创建CustomUserDetails
     */
    public static CustomUserDetails fromSysUser(SysUser user, List<String> roles) {
        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getRealName(),
                user.getTenantId(),
                user.getStatus(),
                roles
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return status == 1;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return status == 1;
    }
}
