package com.medical.ai.controller;

import com.medical.ai.common.Result;
import com.medical.ai.dto.InvokeRequest;
import com.medical.ai.dto.InvokeResponse;
import com.medical.ai.service.AiModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * AI推理调用控制器
 */
@RestController
@RequestMapping("/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI推理调用", description = "AI模型推理调用接口")
public class AiInvokeController {
    
    private final AiModelService aiModelService;
    
    @PostMapping("/invoke")
    @Operation(summary = "同步调用", description = "同步调用AI模型进行推理")
    public Result<InvokeResponse> invoke(@Valid @RequestBody InvokeRequest request) {
        InvokeResponse response = aiModelService.invoke(request);
        return Result.success(response);
    }
    
    @PostMapping("/async-invoke")
    @Operation(summary = "异步调用", description = "异步调用AI模型，返回任务ID")
    public Result<InvokeResponse> asyncInvoke(@Valid @RequestBody InvokeRequest request) {
        InvokeResponse response = aiModelService.asyncInvoke(request);
        return Result.success(response);
    }
    
    @GetMapping("/tasks/{taskId}")
    @Operation(summary = "查询任务状态", description = "查询异步任务执行状态")
    public Result<InvokeResponse> getTaskStatus(@PathVariable String taskId) {
        // TODO: 实现任务状态查询
        return Result.success(InvokeResponse.builder()
                .taskId(taskId)
                .status("PROCESSING")
                .build());
    }
}
