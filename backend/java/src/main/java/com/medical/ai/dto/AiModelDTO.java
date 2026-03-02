package com.medical.ai.dto;

import com.medical.ai.entity.AiModel;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * AI模型DTO
 */
@Data
public class AiModelDTO {
    
    private Long id;
    private String modelId;
    private String name;
    private AiModel.ModelType type;
    private String description;
    private String version;
    private String endpoint;
    private AiModel.ModelStatus status;
    private String icon;
    private String tags;
    private Long tenantId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 统计信息
    private Long todayCalls;
    private Double avgResponseTime;
    private Double accuracy;
}
