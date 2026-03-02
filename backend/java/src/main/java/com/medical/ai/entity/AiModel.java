package com.medical.ai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * AI模型实体类
 */
@Data
@Entity
@Table(name = "ai_model")
@EntityListeners(AuditingEntityListener.class)
public class AiModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "model_id", nullable = false, unique = true, length = 100)
    private String modelId;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ModelType type;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, length = 50)
    private String version;
    
    @Column(nullable = false, length = 500)
    private String endpoint;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ModelStatus status = ModelStatus.OFFLINE;
    
    @Column(length = 255)
    private String icon;
    
    @Column(length = 500)
    private String tags;
    
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * 模型类型枚举
     */
    public enum ModelType {
        LLM,      // 大语言模型
        IMAGE,    // 医学影像诊断
        VOICE,    // 语音识别/合成
        CUSTOM    // 自定义模型
    }
    
    /**
     * 模型状态枚举
     */
    public enum ModelStatus {
        ONLINE,      // 在线运行中
        OFFLINE,     // 已下线
        MAINTENANCE  // 维护中
    }
}
