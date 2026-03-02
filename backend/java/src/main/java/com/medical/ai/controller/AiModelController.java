package com.medical.ai.controller;

import com.medical.ai.common.Result;
import com.medical.ai.dto.AiModelDTO;
import com.medical.ai.dto.InvokeRequest;
import com.medical.ai.dto.InvokeResponse;
import com.medical.ai.entity.AiModel;
import com.medical.ai.service.AiModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI模型管理控制器
 */
@RestController
@RequestMapping("/v1/models")
@RequiredArgsConstructor
@Tag(name = "AI模型管理", description = "AI模型的增删改查和调用")
public class AiModelController {
    
    private final AiModelService aiModelService;
    
    @GetMapping
    @Operation(summary = "获取模型列表", description = "分页获取AI模型列表")
    public Result<Page<AiModelDTO>> getModels(
            @Parameter(description = "租户ID") @RequestParam(defaultValue = "1") Long tenantId,
            @Parameter(description = "模型类型") @RequestParam(required = false) AiModel.ModelType type,
            @Parameter(description = "模型状态") @RequestParam(required = false) AiModel.ModelStatus status,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size) {
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AiModelDTO> models = aiModelService.getModels(tenantId, type, status, keyword, pageRequest);
        return Result.success(models);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取模型详情", description = "根据ID获取模型详情")
    public Result<AiModelDTO> getModel(@PathVariable Long id) {
        return Result.success(aiModelService.getModelById(id));
    }
    
    @GetMapping("/by-model-id/{modelId}")
    @Operation(summary = "根据modelId获取模型", description = "根据模型唯一标识获取模型")
    public Result<AiModelDTO> getModelByModelId(@PathVariable String modelId) {
        return Result.success(aiModelService.getModelByModelId(modelId));
    }
    
    @PostMapping
    @Operation(summary = "创建模型", description = "创建新的AI模型")
    public Result<AiModelDTO> createModel(@Valid @RequestBody AiModelDTO modelDTO) {
        return Result.success(aiModelService.createModel(modelDTO));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "更新模型", description = "更新AI模型信息")
    public Result<AiModelDTO> updateModel(@PathVariable Long id, @Valid @RequestBody AiModelDTO modelDTO) {
        return Result.success(aiModelService.updateModel(id, modelDTO));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除模型", description = "删除AI模型")
    public Result<Void> deleteModel(@PathVariable Long id) {
        aiModelService.deleteModel(id);
        return Result.success();
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "更新模型状态", description = "更新模型在线状态")
    public Result<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam AiModel.ModelStatus status) {
        aiModelService.updateModelStatus(id, status);
        return Result.success();
    }
    
    @GetMapping("/online")
    @Operation(summary = "获取在线模型", description = "获取所有在线的AI模型")
    public Result<List<AiModelDTO>> getOnlineModels(
            @RequestParam(defaultValue = "1") Long tenantId) {
        return Result.success(aiModelService.getOnlineModels(tenantId));
    }
    
    @GetMapping("/{modelId}/stats")
    @Operation(summary = "获取模型统计", description = "获取模型调用统计信息")
    public Result<AiModelDTO> getModelStats(@PathVariable String modelId) {
        return Result.success(aiModelService.getModelStats(modelId));
    }
}
