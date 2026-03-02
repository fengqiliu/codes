package com.medical.ai.service.impl;

import com.medical.ai.common.ErrorCode;
import com.medical.ai.dto.AiModelDTO;
import com.medical.ai.dto.InvokeRequest;
import com.medical.ai.dto.InvokeResponse;
import com.medical.ai.entity.AiModel;
import com.medical.ai.exception.BusinessException;
import com.medical.ai.repository.AiModelRepository;
import com.medical.ai.service.AiModelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * AI模型服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiModelServiceImpl implements AiModelService {
    
    private final AiModelRepository aiModelRepository;
    private final RestTemplate restTemplate;
    
    @Override
    public Page<AiModelDTO> getModels(Long tenantId, AiModel.ModelType type, 
                                       AiModel.ModelStatus status, String keyword, Pageable pageable) {
        return aiModelRepository.findByConditions(tenantId, type, status, keyword, pageable)
                .map(this::convertToDTO);
    }
    
    @Override
    public AiModelDTO getModelById(Long id) {
        AiModel model = aiModelRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MODEL_NOT_FOUND));
        return convertToDTO(model);
    }
    
    @Override
    public AiModelDTO getModelByModelId(String modelId) {
        AiModel model = aiModelRepository.findByModelId(modelId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MODEL_NOT_FOUND));
        return convertToDTO(model);
    }
    
    @Override
    @Transactional
    public AiModelDTO createModel(AiModelDTO modelDTO) {
        if (aiModelRepository.existsByModelId(modelDTO.getModelId())) {
            throw new BusinessException(ErrorCode.MODEL_ALREADY_EXISTS);
        }
        
        AiModel model = new AiModel();
        BeanUtils.copyProperties(modelDTO, model);
        model.setStatus(AiModel.ModelStatus.OFFLINE);
        
        AiModel saved = aiModelRepository.save(model);
        log.info("Created AI model: {}", saved.getModelId());
        
        return convertToDTO(saved);
    }
    
    @Override
    @Transactional
    public AiModelDTO updateModel(Long id, AiModelDTO modelDTO) {
        AiModel model = aiModelRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MODEL_NOT_FOUND));
        
        model.setName(modelDTO.getName());
        model.setDescription(modelDTO.getDescription());
        model.setVersion(modelDTO.getVersion());
        model.setEndpoint(modelDTO.getEndpoint());
        model.setIcon(modelDTO.getIcon());
        model.setTags(modelDTO.getTags());
        
        AiModel saved = aiModelRepository.save(model);
        log.info("Updated AI model: {}", saved.getModelId());
        
        return convertToDTO(saved);
    }
    
    @Override
    @Transactional
    public void deleteModel(Long id) {
        AiModel model = aiModelRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MODEL_NOT_FOUND));
        
        aiModelRepository.delete(model);
        log.info("Deleted AI model: {}", model.getModelId());
    }
    
    @Override
    @Transactional
    public void updateModelStatus(Long id, AiModel.ModelStatus status) {
        AiModel model = aiModelRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MODEL_NOT_FOUND));
        
        model.setStatus(status);
        aiModelRepository.save(model);
        log.info("Updated model {} status to {}", model.getModelId(), status);
    }
    
    @Override
    public List<AiModelDTO> getOnlineModels(Long tenantId) {
        return aiModelRepository.findByStatus(AiModel.ModelStatus.ONLINE)
                .stream()
                .filter(m -> m.getTenantId().equals(tenantId))
                .map(this::convertToDTO)
                .toList();
    }
    
    @Override
    public InvokeResponse invoke(InvokeRequest request) {
        String requestId = request.getRequestId() != null ? 
                request.getRequestId() : UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();
        
        try {
            // 获取模型信息
            AiModel model = aiModelRepository.findByModelId(request.getModelId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.MODEL_NOT_FOUND));
            
            // 检查模型状态
            if (model.getStatus() != AiModel.ModelStatus.ONLINE) {
                throw new BusinessException(
                        model.getStatus() == AiModel.ModelStatus.MAINTENANCE ? 
                                ErrorCode.MODEL_MAINTENANCE : ErrorCode.MODEL_OFFLINE);
            }
            
            // 调用AI服务
            Map<String, Object> result = callAiService(model, request);
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            return InvokeResponse.success(
                    requestId,
                    model.getModelId(),
                    result,
                    (Double) result.getOrDefault("confidence", 0.95),
                    processingTime
            );
            
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("AI invoke error: {}", e.getMessage(), e);
            return InvokeResponse.error(requestId, ErrorCode.AI_SERVICE_ERROR.name(), e.getMessage());
        }
    }
    
    @Override
    public InvokeResponse asyncInvoke(InvokeRequest request) {
        String requestId = request.getRequestId() != null ? 
                request.getRequestId() : UUID.randomUUID().toString();
        String taskId = "task_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        
        // TODO: 发送到消息队列进行异步处理
        log.info("Async invoke task created: {}", taskId);
        
        return InvokeResponse.pending(requestId, taskId);
    }
    
    @Override
    public AiModelDTO getModelStats(String modelId) {
        AiModelDTO dto = getModelByModelId(modelId);
        // TODO: 从统计表获取数据
        dto.setTodayCalls(45230L);
        dto.setAvgResponseTime(1250.0);
        dto.setAccuracy(98.5);
        return dto;
    }
    
    /**
     * 调用AI服务
     */
    private Map<String, Object> callAiService(AiModel model, InvokeRequest request) {
        // 构建请求
        Map<String, Object> aiRequest = new HashMap<>();
        aiRequest.put("input", request.getInput());
        aiRequest.put("options", request.getOptions());
        
        // 调用服务端点
        // 这里简化处理，实际应该根据模型类型调用不同的服务
        log.info("Calling AI service: {} for model: {}", model.getEndpoint(), model.getModelId());
        
        // 模拟返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("confidence", 0.95);
        result.put("conclusion", "分析完成");
        
        return result;
    }
    
    /**
     * 转换为DTO
     */
    private AiModelDTO convertToDTO(AiModel model) {
        AiModelDTO dto = new AiModelDTO();
        BeanUtils.copyProperties(model, dto);
        return dto;
    }
}
