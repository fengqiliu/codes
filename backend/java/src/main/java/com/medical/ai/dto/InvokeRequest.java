package com.medical.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

/**
 * AI模型调用请求DTO
 */
@Data
public class InvokeRequest {
    
    @NotBlank(message = "模型ID不能为空")
    private String modelId;
    
    /** 请求ID(可选，用于幂等) */
    private String requestId;
    
    @NotNull(message = "输入数据不能为空")
    private InputData input;
    
    /** 调用选项 */
    private InvokeOptions options;
    
    @Data
    public static class InputData {
        /** 数据类型: text/dicom/image/audio */
        private String type;
        /** 数据内容(base64编码或文本) */
        private String data;
        /** 元数据 */
        private Map<String, Object> metadata;
    }
    
    @Data
    public static class InvokeOptions {
        /** 超时时间(ms) */
        private Integer timeout = 30000;
        /** 优先级: low/normal/high */
        private String priority = "normal";
        /** 是否异步 */
        private Boolean async = false;
        /** 回调URL */
        private String callbackUrl;
    }
}
