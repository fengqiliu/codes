'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Square,
  Copy,
  Edit,
  Trash2,
  Eye,
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  FileJson,
  Download,
  Share2,
  Activity
} from 'lucide-react'

interface WorkflowItem {
  id: string
  name: string
  description: string
  version: string
  status: 'draft' | 'published' | 'archived'
  execStatus: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  nodeCount: number
  execCount: number
  successRate: string
  avgDuration: string
  lastExec: string
  createdAt: string
  author: string
}

const mockWorkflows: WorkflowItem[] = [
  {
    id: '1',
    name: '肺结节AI诊断流程',
    description: '基于CT影像的肺结节智能筛查与诊断建议生成',
    version: 'v2.3',
    status: 'published',
    execStatus: 'completed',
    nodeCount: 8,
    execCount: 1248,
    successRate: '98.5%',
    avgDuration: '3.2秒',
    lastExec: '5分钟前',
    createdAt: '2024-01-15',
    author: '张医生'
  },
  {
    id: '2',
    name: '医疗报告自动生成',
    description: '从影像数据到结构化诊断报告的端到端流程',
    version: 'v1.8',
    status: 'published',
    execStatus: 'running',
    nodeCount: 12,
    execCount: 856,
    successRate: '96.8%',
    avgDuration: '5.8秒',
    lastExec: '正在运行',
    createdAt: '2024-02-20',
    author: '李主任'
  },
  {
    id: '3',
    name: '病理切片分析流程',
    description: '病理图像的智能分析与量化评分',
    version: 'v3.1',
    status: 'published',
    execStatus: 'failed',
    nodeCount: 10,
    execCount: 632,
    successRate: '97.2%',
    avgDuration: '4.5秒',
    lastExec: '2小时前',
    createdAt: '2024-03-10',
    author: '王教授'
  },
  {
    id: '4',
    name: '多模态影像融合',
    description: 'CT、MRI、PET等多源影像的智能配准与分析',
    version: 'v1.2',
    status: 'draft',
    execStatus: 'pending',
    nodeCount: 15,
    execCount: 0,
    successRate: '-',
    avgDuration: '-',
    lastExec: '未执行',
    createdAt: '2024-04-05',
    author: '赵研究员'
  }
]

const statusConfig = {
  draft: { label: '草稿', color: 'bg-muted text-muted-foreground' },
  published: { label: '已发布', color: 'bg-success text-success-foreground' },
  archived: { label: '已归档', color: 'bg-secondary text-secondary-foreground' }
}

const execStatusConfig = {
  pending: { label: '待执行', icon: Clock, color: 'text-muted-foreground bg-muted' },
  running: { label: '运行中', icon: Loader2, color: 'text-primary bg-primary-light animate-pulse' },
  completed: { label: '已完成', icon: CheckCircle2, color: 'text-success bg-success-light' },
  failed: { label: '失败', icon: XCircle, color: 'text-destructive bg-destructive/10' },
  paused: { label: '已暂停', icon: Pause, color: 'text-warning bg-warning-light' }
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(mockWorkflows)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWorkflows = workflows.filter(wf =>
    wf.name.includes(searchTerm) ||
    wf.description.includes(searchTerm) ||
    wf.author.includes(searchTerm)
  )

  const handleExecute = (id: string) => {
    setWorkflows(workflows.map(wf =>
      wf.id === id ? { ...wf, execStatus: 'running' as const, lastExec: '正在运行' } : wf
    ))
    setTimeout(() => {
      setWorkflows(workflows.map(wf =>
        wf.id === id ? { ...wf, execStatus: 'completed' as const, execCount: wf.execCount + 1, lastExec: '刚刚' } : wf
      ))
    }, 3000)
  }

  const handlePause = (id: string) => {
    setWorkflows(workflows.map(wf =>
      wf.id === id ? { ...wf, execStatus: 'paused' as const } : wf
    ))
  }

  const handleStop = (id: string) => {
    setWorkflows(workflows.map(wf =>
      wf.id === id ? { ...wf, execStatus: 'pending' as const } : wf
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该流程吗?此操作不可撤销。')) {
      setWorkflows(workflows.filter(wf => wf.id !== id))
    }
  }

  const handleDuplicate = (id: string) => {
    const original = workflows.find(wf => wf.id === id)
    if (original) {
      const newWorkflow = {
        ...original,
        id: Date.now().toString(),
        name: `${original.name} (副本)`,
        status: 'draft' as const,
        execStatus: 'pending' as const,
        execCount: 0,
        lastExec: '未执行',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setWorkflows([newWorkflow, ...workflows])
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">流程编排</h1>
            <p className="text-muted-foreground mt-1">可视化配置AI诊断流程并实时监控执行状态</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileJson className="w-4 h-4 mr-2" />
              导入流程
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              创建流程
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总流程数</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{workflows.length}</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <Workflow className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">运行中</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {workflows.filter(wf => wf.execStatus === 'running').length}
                  </p>
                </div>
                <div className="p-3 bg-accent-light rounded-xl">
                  <Activity className="w-6 h-6 text-accent animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日执行</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {workflows.reduce((sum, wf) => sum + wf.execCount, 0)}
                  </p>
                </div>
                <div className="p-3 bg-success-light rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均成功率</p>
                  <p className="text-3xl font-bold text-foreground mt-2">97.6%</p>
                </div>
                <div className="p-3 bg-warning-light rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索流程名称、描述或作者..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 流程列表 */}
        <div className="grid grid-cols-1 gap-4">
          {filteredWorkflows.map((workflow) => {
            const ExecStatusIcon = execStatusConfig[workflow.execStatus].icon
            return (
              <Card key={workflow.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* 左侧信息 */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary-light rounded-xl">
                            <GitBranch className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground text-lg">{workflow.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig[workflow.status].color}`}>
                                {statusConfig[workflow.status].label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* 指标 */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">节点数</p>
                          <p className="text-sm font-semibold text-foreground mt-1">{workflow.nodeCount} 个</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">执行次数</p>
                          <p className="text-sm font-semibold text-foreground mt-1">{workflow.execCount} 次</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">成功率</p>
                          <p className="text-sm font-semibold text-foreground mt-1">{workflow.successRate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">平均耗时</p>
                          <p className="text-sm font-semibold text-foreground mt-1">{workflow.avgDuration}</p>
                        </div>
                      </div>

                      {/* 元信息 */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>版本 {workflow.version}</span>
                        <span>•</span>
                        <span>创建于 {workflow.createdAt}</span>
                        <span>•</span>
                        <span>作者: {workflow.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {workflow.lastExec}
                        </span>
                      </div>
                    </div>

                    {/* 右侧状态与操作 */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-3">
                      {/* 执行状态 */}
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${execStatusConfig[workflow.execStatus].color}`}>
                        <ExecStatusIcon className={`w-4 h-4 ${workflow.execStatus === 'running' ? 'animate-spin' : ''}`} />
                        {execStatusConfig[workflow.execStatus].label}
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-1">
                        {workflow.execStatus === 'running' ? (
                          <>
                            <button
                              onClick={() => handlePause(workflow.id)}
                              className="p-2 hover:bg-warning/10 rounded-lg transition-colors"
                              title="暂停执行"
                            >
                              <Pause className="w-4 h-4 text-warning" />
                            </button>
                            <button
                              onClick={() => handleStop(workflow.id)}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              title="停止执行"
                            >
                              <Square className="w-4 h-4 text-destructive" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleExecute(workflow.id)}
                            disabled={workflow.status === 'draft'}
                            className="p-2 hover:bg-success/10 rounded-lg transition-colors disabled:opacity-50"
                            title="执行流程"
                          >
                            <Play className="w-4 h-4 text-success" />
                          </button>
                        )}
                        <button
                          onClick={() => alert(`查看流程详情: ${workflow.name}`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => alert(`编辑流程: ${workflow.name}`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="编辑流程"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(workflow.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="复制流程"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => alert(`导出流程: ${workflow.name}`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="导出流程"
                        >
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(workflow.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="删除流程"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="更多操作">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredWorkflows.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">没有找到匹配的流程</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
