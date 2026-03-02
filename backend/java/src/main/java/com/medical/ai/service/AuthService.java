package com.medical.ai.service;

import com.medical.ai.dto.LoginRequest;
import com.medical.ai.dto.LoginResponse;

/**
 * 认证服务接口
 */
public interface AuthService {
    
    /**
     * 用户登录
     */
    LoginResponse login(LoginRequest request);
    
    /**
     * 刷新令牌
     */
    LoginResponse refreshToken(String refreshToken);
    
    /**
     * 用户登出
     */
    void logout(String token);
    
    /**
     * 验证令牌
     */
    boolean validateToken(String token);
}
