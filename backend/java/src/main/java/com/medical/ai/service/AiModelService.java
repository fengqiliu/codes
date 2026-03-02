package com.medical.ai.service;

import com.medical.ai.dto.AiModelDTO;
import com.medical.ai.dto.InvokeRequest;
import com.medical.ai.dto.InvokeResponse;
import com.medical.ai.entity.AiModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * AI模型服务接口
 */
public interface AiModelService {
    
    /**
     * 获取模型列表
     */
    Page<AiModelDTO> getModels(Long tenantId, AiModel.ModelType type, 
                               AiModel.ModelStatus status, String keyword, Pageable pageable);
    
    /**
     * 获取模型详情
     */
    AiModelDTO getModelById(Long id);
    
    /**
     * 根据modelId获取模型
     */
    AiModelDTO getModelByModelId(String modelId);
    
    /**
     * 创建模型
     */
    AiModelDTO createModel(AiModelDTO modelDTO);
    
    /**
     * 更新模型
     */
    AiModelDTO updateModel(Long id, AiModelDTO modelDTO);
    
    /**
     * 删除模型
     */
    void deleteModel(Long id);
    
    /**
     * 更新模型状态
     */
    void updateModelStatus(Long id, AiModel.ModelStatus status);
    
    /**
     * 获取在线模型列表
     */
    List<AiModelDTO> getOnlineModels(Long tenantId);
    
    /**
     * 同步调用AI模型
     */
    InvokeResponse invoke(InvokeRequest request);
    
    /**
     * 异步调用AI模型
     */
    InvokeResponse asyncInvoke(InvokeRequest request);
    
    /**
     * 获取模型统计数据
     */
    AiModelDTO getModelStats(String modelId);
}
