'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Brain, Eye, FileText, Mic, Image, Search, Filter, Plus,
  MoreVertical, Play, Pause, Settings, Trash2, Edit, 
  CheckCircle2, AlertCircle, Clock, TrendingUp
} from 'lucide-react'

// 模型数据
const models = [
  {
    id: 1,
    modelId: 'lung-nodule-v1',
    name: '肺结节智能筛查',
    type: 'IMAGE',
    description: '基于深度学习的肺结节自动检测与分析系统，支持CT影像',
    version: '1.0.0',
    status: 'ONLINE',
    todayCalls: 45230,
    avgResponseTime: 1250,
    accuracy: 98.5,
    icon: Eye
  },
  {
    id: 2,
    modelId: 'medical-report-v1',
    name: '医疗报告生成',
    type: 'LLM',
    description: '基于大语言模型的医疗报告智能生成系统',
    version: '1.0.0',
    status: 'ONLINE',
    todayCalls: 32180,
    avgResponseTime: 2100,
    accuracy: 96.8,
    icon: FileText
  },
  {
    id: 3,
    modelId: 'pathology-v1',
    name: '病理切片分析',
    type: 'IMAGE',
    description: '病理切片AI辅助诊断系统',
    version: '1.0.0',
    status: 'ONLINE',
    todayCalls: 28650,
    avgResponseTime: 3200,
    accuracy: 97.2,
    icon: Image
  },
  {
    id: 4,
    modelId: 'voice-transcribe-v1',
    name: '语音病历转写',
    type: 'VOICE',
    description: '医疗语音实时转写系统',
    version: '1.0.0',
    status: 'MAINTENANCE',
    todayCalls: 15420,
    avgResponseTime: 800,
    accuracy: 94.6,
    icon: Mic
  },
  {
    id: 5,
    modelId: 'bone-age-v1',
    name: '骨龄评估AI',
    type: 'IMAGE',
    description: '儿童骨龄智能评估系统',
    version: '1.0.0',
    status: 'ONLINE',
    todayCalls: 8920,
    avgResponseTime: 1800,
    accuracy: 95.3,
    icon: Eye
  },
  {
    id: 6,
    modelId: 'ecg-analysis-v1',
    name: '心电图智能分析',
    type: 'IMAGE',
    description: '12导联心电图AI辅助诊断',
    version: '1.0.0',
    status: 'OFFLINE',
    todayCalls: 0,
    avgResponseTime: 0,
    accuracy: 93.8,
    icon: Eye
  }
]

const typeLabels: Record<string, string> = {
  LLM: '大语言模型',
  IMAGE: '影像诊断',
  VOICE: '语音服务',
  CUSTOM: '自定义'
}

const typeColors: Record<string, string> = {
  LLM: 'bg-accent-light text-accent',
  IMAGE: 'bg-primary-light text-primary',
  VOICE: 'bg-secondary/20 text-secondary',
  CUSTOM: 'bg-muted text-muted-foreground'
}

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.modelId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || model.type === filterType
    const matchesStatus = !filterStatus || model.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI模型管理</h1>
          <p className="text-muted-foreground mt-1">管理和监控已接入的AI模型</p>
        </div>
        <Button variant="gradient">
          <Plus className="w-4 h-4 mr-2" />
          接入新模型
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总模型数</p>
                <p className="text-2xl font-bold">{models.length}</p>
              </div>
              <div className="p-2 bg-primary-light rounded-lg">
                <Brain className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">在线模型</p>
                <p className="text-2xl font-bold text-success">
                  {models.filter(m => m.status === 'ONLINE').length}
                </p>
              </div>
              <div className="p-2 bg-success-light rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">维护中</p>
                <p className="text-2xl font-bold text-warning">
                  {models.filter(m => m.status === 'MAINTENANCE').length}
                </p>
              </div>
              <div className="p-2 bg-warning-light rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日总调用</p>
                <p className="text-2xl font-bold">
                  {models.reduce((acc, m) => acc + m.todayCalls, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-accent-light rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索模型名称或ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType || ''}
                onChange={(e) => setFilterType(e.target.value || null)}
                className="h-10 px-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">全部类型</option>
                <option value="LLM">大语言模型</option>
                <option value="IMAGE">影像诊断</option>
                <option value="VOICE">语音服务</option>
              </select>
              <select
                value={filterStatus || ''}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="h-10 px-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">全部状态</option>
                <option value="ONLINE">在线</option>
                <option value="OFFLINE">离线</option>
                <option value="MAINTENANCE">维护中</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 模型列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <Card key={model.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary-light rounded-xl">
                    <model.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{model.name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-mono">{model.modelId}</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[model.type]}`}>
                  {typeLabels[model.type]}
                </span>
                <span className="text-xs text-muted-foreground">v{model.version}</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                  model.status === 'ONLINE' ? 'bg-success-light text-success' :
                  model.status === 'MAINTENANCE' ? 'bg-warning-light text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {model.status === 'ONLINE' ? '运行中' : 
                   model.status === 'MAINTENANCE' ? '维护中' : '已下线'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{model.todayCalls.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">今日调用</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{model.avgResponseTime}ms</p>
                  <p className="text-xs text-muted-foreground">响应时间</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{model.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">准确率</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {model.status === 'ONLINE' ? (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pause className="w-3.5 h-3.5 mr-1.5" />
                    暂停
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    启动
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-3.5 h-3.5 mr-1.5" />
                  配置
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">没有找到匹配的模型</p>
        </div>
      )}
    </div>
  )
}
