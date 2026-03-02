package com.medical.ai.controller;

import com.medical.ai.common.Result;
import com.medical.ai.dto.LoginRequest;
import com.medical.ai.dto.LoginResponse;
import com.medical.ai.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 处理用户登录、登出、令牌刷新等操作
 */
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "认证管理", description = "用户登录、登出、令牌刷新等")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "使用用户名和密码登录，获取JWT令牌")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success(response);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌", description = "使用刷新令牌获取新的访问令牌")
    public Result<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request.getRefreshToken());
        return Result.success(response);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "使当前令牌失效")
    public Result<Void> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        authService.logout(token);
        return Result.success();
    }
    
    @GetMapping("/validate")
    @Operation(summary = "验证令牌", description = "验证当前令牌是否有效")
    public Result<Boolean> validateToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        boolean valid = authService.validateToken(token);
        return Result.success(valid);
    }
    
    /**
     * 刷新令牌请求DTO
     */
    public record RefreshTokenRequest(String refreshToken) {}
}
