package com.medical.ai.common;

import lombok.Getter;

/**
 * 错误码枚举
 */
@Getter
public enum ErrorCode {
    
    // 系统级错误 1xxxxx
    SYSTEM_ERROR(101001, "系统内部错误"),
    SERVICE_UNAVAILABLE(101002, "服务不可用"),
    
    // 认证授权错误 2010xx
    INVALID_CREDENTIALS(201001, "用户名或密码错误"),
    TOKEN_EXPIRED(201002, "Token已过期"),
    TOKEN_INVALID(201003, "Token无效"),
    ACCESS_DENIED(201004, "无权限访问"),
    ACCOUNT_DISABLED(201005, "账户已禁用"),
    
    // 模型相关错误 2020xx
    MODEL_NOT_FOUND(202001, "模型不存在"),
    MODEL_OFFLINE(202002, "模型已下线"),
    MODEL_MAINTENANCE(202003, "模型维护中"),
    MODEL_ALREADY_EXISTS(202004, "模型已存在"),
    
    // API相关错误 2030xx
    RATE_LIMIT_EXCEEDED(203001, "请求频率超限"),
    INVALID_REQUEST(203002, "请求参数错误"),
    API_NOT_FOUND(203003, "接口不存在"),
    API_KEY_INVALID(203004, "API Key无效"),
    
    // 第三方服务错误 3xxxxx
    AI_SERVICE_TIMEOUT(301001, "AI服务调用超时"),
    AI_SERVICE_ERROR(301002, "AI服务调用失败"),
    EXTERNAL_SERVICE_ERROR(301003, "外部服务调用失败");
    
    private final int code;
    private final String message;
    
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
