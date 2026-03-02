package com.medical.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * AI模型调用响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvokeResponse {
    
    /** 请求ID */
    private String requestId;
    
    /** 模型ID */
    private String modelId;
    
    /** 任务ID(异步调用时返回) */
    private String taskId;
    
    /** 状态: SUCCESS/FAILED/PENDING */
    private String status;
    
    /** 推理结果 */
    private Map<String, Object> result;
    
    /** 置信度 */
    private Double confidence;
    
    /** 处理时间(ms) */
    private Long processingTime;
    
    /** 错误信息 */
    private String errorMessage;
    
    /** 错误码 */
    private String errorCode;
    
    public static InvokeResponse success(String requestId, String modelId, Map<String, Object> result, Double confidence, Long processingTime) {
        return InvokeResponse.builder()
                .requestId(requestId)
                .modelId(modelId)
                .status("SUCCESS")
                .result(result)
                .confidence(confidence)
                .processingTime(processingTime)
                .build();
    }
    
    public static InvokeResponse pending(String requestId, String taskId) {
        return InvokeResponse.builder()
                .requestId(requestId)
                .taskId(taskId)
                .status("PENDING")
                .build();
    }
    
    public static InvokeResponse error(String requestId, String errorCode, String errorMessage) {
        return InvokeResponse.builder()
                .requestId(requestId)
                .status("FAILED")
                .errorCode(errorCode)
                .errorMessage(errorMessage)
                .build();
    }
}
