package com.medical.ai.service.impl;

import com.medical.ai.common.ErrorCode;
import com.medical.ai.dto.LoginRequest;
import com.medical.ai.dto.LoginResponse;
import com.medical.ai.entity.SysUser;
import com.medical.ai.exception.BusinessException;
import com.medical.ai.repository.SysUserRepository;
import com.medical.ai.security.CustomUserDetails;
import com.medical.ai.security.JwtProperties;
import com.medical.ai.security.JwtTokenProvider;
import com.medical.ai.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final SysUserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    
    private static final String TOKEN_BLACKLIST_PREFIX = "jwt:blacklist:";
    
    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            // 进行认证
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            // 设置认证信息到SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 获取用户信息
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            
            // 生成令牌
            String[] roles = userDetails.getRoles().toArray(new String[0]);
            String accessToken = jwtTokenProvider.generateToken(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getTenantId(),
                    roles
            );
            String refreshToken = jwtTokenProvider.generateRefreshToken(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getTenantId()
            );
            
            // 更新最后登录时间
            updateLastLoginInfo(userDetails.getId());
            
            log.info("User {} logged in successfully", request.getUsername());
            
            // 构建响应
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(jwtProperties.getExpiration() / 1000)
                    .tokenType("Bearer")
                    .userInfo(LoginResponse.UserInfo.builder()
                            .id(userDetails.getId())
                            .username(userDetails.getUsername())
                            .realName(userDetails.getRealName())
                            .email(userDetails.getEmail())
                            .avatar(null)
                            .build())
                    .build();
                    
        } catch (DisabledException e) {
            log.warn("Account disabled: {}", request.getUsername());
            throw new BusinessException(ErrorCode.ACCOUNT_DISABLED);
        } catch (BadCredentialsException e) {
            log.warn("Invalid credentials for user: {}", request.getUsername());
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        } catch (Exception e) {
            log.error("Login error for user: {}", request.getUsername(), e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "登录失败: " + e.getMessage());
        }
    }
    
    @Override
    public LoginResponse refreshToken(String refreshToken) {
        // 验证刷新令牌
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID, "刷新令牌无效");
        }
        
        // 检查是否是刷新令牌类型
        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID, "令牌类型错误");
        }
        
        // 检查令牌是否在黑名单中
        if (isTokenBlacklisted(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID, "令牌已失效");
        }
        
        // 从刷新令牌中提取信息
        String username = jwtTokenProvider.extractUsername(refreshToken);
        Long userId = jwtTokenProvider.extractUserId(refreshToken);
        Long tenantId = jwtTokenProvider.extractTenantId(refreshToken);
        
        // 验证用户是否存在
        SysUser user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS, "用户不存在"));
        
        // 检查用户状态
        if (user.getStatus() != 1) {
            throw new BusinessException(ErrorCode.ACCOUNT_DISABLED);
        }
        
        // 生成新的访问令牌
        String[] roles = {"USER"}; // TODO: 从数据库获取角色
        String newAccessToken = jwtTokenProvider.generateToken(userId, username, tenantId, roles);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userId, username, tenantId);
        
        // 将旧的刷新令牌加入黑名单
        addToBlacklist(refreshToken);
        
        log.info("Token refreshed for user: {}", username);
        
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtProperties.getExpiration() / 1000)
                .tokenType("Bearer")
                .userInfo(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .realName(user.getRealName())
                        .email(user.getEmail())
                        .build())
                .build();
    }
    
    @Override
    public void logout(String token) {
        if (token != null && token.startsWith(jwtProperties.getPrefix())) {
            token = token.substring(jwtProperties.getPrefix().length());
        }
        
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // 将令牌加入黑名单
            addToBlacklist(token);
            
            String username = jwtTokenProvider.extractUsername(token);
            log.info("User {} logged out", username);
        }
        
        // 清除SecurityContext
        SecurityContextHolder.clearContext();
    }
    
    @Override
    public boolean validateToken(String token) {
        if (isTokenBlacklisted(token)) {
            return false;
        }
        return jwtTokenProvider.validateToken(token);
    }
    
    /**
     * 更新最后登录信息
     */
    private void updateLastLoginInfo(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            // TODO: 获取客户端IP
            userRepository.save(user);
        });
    }
    
    /**
     * 将令牌加入黑名单
     */
    private void addToBlacklist(String token) {
        try {
            Long remainingTime = jwtTokenProvider.getTokenRemainingTime(token);
            if (remainingTime > 0) {
                redisTemplate.opsForValue().set(
                        TOKEN_BLACKLIST_PREFIX + token,
                        "1",
                        remainingTime,
                        TimeUnit.MILLISECONDS
                );
            }
        } catch (Exception e) {
            log.warn("Failed to add token to blacklist: {}", e.getMessage());
        }
    }
    
    /**
     * 检查令牌是否在黑名单中
     */
    private boolean isTokenBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(TOKEN_BLACKLIST_PREFIX + token));
        } catch (Exception e) {
            log.warn("Failed to check token blacklist: {}", e.getMessage());
            return false;
        }
    }
}
