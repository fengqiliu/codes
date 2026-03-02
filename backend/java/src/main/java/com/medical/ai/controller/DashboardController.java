package com.medical.ai.controller;

import com.medical.ai.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 仪表板控制器
 */
@RestController
@RequestMapping("/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "控制台", description = "仪表板数据接口")
public class DashboardController {
    
    @GetMapping("/stats")
    @Operation(summary = "获取统计数据", description = "获取仪表板统计数据")
    public Result<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 今日调用量
        stats.put("todayCalls", 128456);
        stats.put("todayCallsChange", "+12.5%");
        
        // 在线模型数
        stats.put("onlineModels", 24);
        stats.put("onlineModelsChange", "+2");
        
        // 平均响应时间
        stats.put("avgResponseTime", 186);
        stats.put("avgResponseTimeChange", "-8.2%");
        
        // 系统可用率
        stats.put("availability", "99.97%");
        stats.put("availabilityChange", "+0.02%");
        
        return Result.success(stats);
    }
    
    @GetMapping("/system-metrics")
    @Operation(summary = "获取系统指标", description = "获取系统资源使用情况")
    public Result<Map<String, Object>> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        metrics.put("cpuUsage", 45);
        metrics.put("memoryUsage", 62);
        metrics.put("networkBandwidth", 38);
        metrics.put("diskUsage", 55);
        
        return Result.success(metrics);
    }
    
    @GetMapping("/recent-activities")
    @Operation(summary = "获取最近活动", description = "获取系统最近活动日志")
    public Result<Object> getRecentActivities() {
        // 返回最近活动列表
        return Result.success(new Object[]{
            Map.of("time", "2分钟前", "event", "新接入模型：骨龄评估AI", "type", "success"),
            Map.of("time", "15分钟前", "event", "HIS系统完成API对接测试", "type", "success"),
            Map.of("time", "32分钟前", "event", "语音病历转写模型进入维护", "type", "warning"),
            Map.of("time", "1小时前", "event", "系统自动完成负载均衡调度", "type", "info"),
            Map.of("time", "2小时前", "event", "影像云平台调用量达到峰值", "type", "info")
        });
    }
}
