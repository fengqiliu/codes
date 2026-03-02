package com.medical.ai.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * 安全上下文工具类
 * 提供获取当前登录用户信息的便捷方法
 */
@Component
public class SecurityContextUtil {
    
    /**
     * 获取当前登录用户
     */
    public static CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return (CustomUserDetails) authentication.getPrincipal();
        }
        return null;
    }
    
    /**
     * 获取当前用户ID
     */
    public static Long getCurrentUserId() {
        CustomUserDetails user = getCurrentUser();
        return user != null ? user.getId() : null;
    }
    
    /**
     * 获取当前用户名
     */
    public static String getCurrentUsername() {
        CustomUserDetails user = getCurrentUser();
        return user != null ? user.getUsername() : null;
    }
    
    /**
     * 获取当前租户ID
     */
    public static Long getCurrentTenantId() {
        CustomUserDetails user = getCurrentUser();
        return user != null ? user.getTenantId() : null;
    }
    
    /**
     * 检查当前用户是否已认证
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null 
                && authentication.isAuthenticated() 
                && authentication.getPrincipal() instanceof CustomUserDetails;
    }
    
    /**
     * 检查当前用户是否拥有指定角色
     */
    public static boolean hasRole(String role) {
        CustomUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        return user.getRoles().contains(role);
    }
    
    /**
     * 检查当前用户是否是管理员
     */
    public static boolean isAdmin() {
        return hasRole("ADMIN") || hasRole("SUPER_ADMIN");
    }
}
