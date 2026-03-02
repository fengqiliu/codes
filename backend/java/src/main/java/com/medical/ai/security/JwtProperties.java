package com.medical.ai.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT配置属性类
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    
    /**
     * JWT密钥
     */
    private String secret = "medical-ai-platform-jwt-secret-key-2026-very-long-and-secure-256-bits";
    
    /**
     * 访问令牌过期时间(毫秒) - 默认1小时
     */
    private Long expiration = 3600000L;
    
    /**
     * 刷新令牌过期时间(毫秒) - 默认7天
     */
    private Long refreshExpiration = 604800000L;
    
    /**
     * 请求头名称
     */
    private String header = "Authorization";
    
    /**
     * 令牌前缀
     */
    private String prefix = "Bearer ";
    
    /**
     * 签发者
     */
    private String issuer = "medical-ai-platform";
}
