package com.medical.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    /** 访问令牌 */
    private String accessToken;
    
    /** 刷新令牌 */
    private String refreshToken;
    
    /** 过期时间(秒) */
    private Long expiresIn;
    
    /** 令牌类型 */
    private String tokenType;
    
    /** 用户信息 */
    private UserInfo userInfo;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String realName;
        private String email;
        private String avatar;
    }
}
