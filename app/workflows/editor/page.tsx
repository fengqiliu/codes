'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Play,
  Zap,
  Circle,
  Square,
  GitBranch,
  ArrowRight,
  Trash2,
  Copy,
  Save,
  X
} from 'lucide-react'

interface FlowNode {
  id: string
  type: 'start' | 'ai-model' | 'transform' | 'condition' | 'end'
  label: string
  x: number
  y: number
  config?: any
}

interface FlowConnection {
  from: string
  to: string
}

const nodeTypes = [
  { type: 'start', label: '开始', icon: Circle, color: 'bg-success-light text-success' },
  { type: 'ai-model', label: 'AI模型调用', icon: Zap, color: 'bg-primary-light text-primary' },
  { type: 'transform', label: '数据转换', icon: GitBranch, color: 'bg-accent-light text-accent' },
  { type: 'condition', label: '条件判断', icon: GitBranch, color: 'bg-warning-light text-warning' },
  { type: 'end', label: '结束', icon: Square, color: 'bg-muted text-muted-foreground' }
]

export default function FlowEditorPage() {
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', type: 'start', label: '开始', x: 100, y: 200 },
    { id: '2', type: 'ai-model', label: '肺结节检测', x: 300, y: 200 },
    { id: '3', type: 'condition', label: '结果判断', x: 500, y: 200 },
    { id: '4', type: 'end', label: '结束', x: 700, y: 200 }
  ])
  const [connections, setConnections] = useState<FlowConnection[]>([
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' }
  ])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<FlowNode | null>(null)

  const handleAddNode = (type: string) => {
    const newNode: FlowNode = {
      id: Date.now().toString(),
      type: type as any,
      label: nodeTypes.find(nt => nt.type === type)?.label || '新节点',
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200
    }
    setNodes([...nodes, newNode])
  }

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id))
    setConnections(connections.filter(c => c.from !== id && c.to !== id))
    if (selectedNode === id) setSelectedNode(null)
  }

  const handleSaveFlow = () => {
    const flowData = { nodes, connections }
    console.log('保存流程:', flowData)
    alert('流程已保存!')
  }

  const handleExecuteFlow = () => {
    alert('开始执行流程...')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">流程可视化编辑器</h1>
            <p className="text-sm text-muted-foreground mt-1">拖拽节点创建AI诊断流程</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setNodes([])}>
              <X className="w-4 h-4 mr-2" />
              清空
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveFlow}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button size="sm" onClick={handleExecuteFlow}>
              <Play className="w-4 h-4 mr-2" />
              执行流程
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧节点面板 */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">节点库</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nodeTypes.map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <button
                      key={nodeType.type}
                      onClick={() => handleAddNode(nodeType.type)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:scale-105 ${nodeType.color}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{nodeType.label}</span>
                      <Plus className="w-4 h-4 ml-auto" />
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="text-sm font-medium text-foreground">流程统计</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">节点数量</span>
                    <span className="font-semibold text-foreground">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">连接数量</span>
                    <span className="font-semibold text-foreground">{connections.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 中间画布区域 */}
          <Card className="col-span-6">
            <CardHeader>
              <CardTitle className="text-lg">流程画布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[600px] bg-muted/30 rounded-lg border-2 border-dashed overflow-hidden">
                {/* 绘制连接线 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map((conn, idx) => {
                    const fromNode = nodes.find(n => n.id === conn.from)
                    const toNode = nodes.find(n => n.id === conn.to)
                    if (!fromNode || !toNode) return null
                    
                    return (
                      <g key={idx}>
                        <line
                          x1={fromNode.x + 60}
                          y1={fromNode.y + 20}
                          x2={toNode.x}
                          y2={toNode.y + 20}
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                        <circle
                          cx={toNode.x}
                          cy={toNode.y + 20}
                          r="4"
                          fill="hsl(var(--primary))"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* 渲染节点 */}
                {nodes.map((node) => {
                  const nodeType = nodeTypes.find(nt => nt.type === node.type)
                  const Icon = nodeType?.icon || Circle
                  return (
                    <div
                      key={node.id}
                      className={`absolute cursor-move transition-all ${
                        selectedNode === node.id ? 'ring-2 ring-primary scale-105' : ''
                      }`}
                      style={{ left: node.x, top: node.y }}
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${nodeType?.color || 'bg-card'}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{node.label}</span>
                        {selectedNode === node.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNode(node.id)
                            }}
                            className="ml-2 p-1 hover:bg-destructive/20 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">从左侧拖拽节点开始创建流程</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 右侧属性面板 */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">节点属性</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  {(() => {
                    const node = nodes.find(n => n.id === selectedNode)
                    if (!node) return null
                    return (
                      <>
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">节点名称</label>
                          <input
                            type="text"
                            value={node.label}
                            onChange={(e) => {
                              setNodes(nodes.map(n => 
                                n.id === selectedNode ? { ...n, label: e.target.value } : n
                              ))
                            }}
                            className="w-full h-9 px-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">节点类型</label>
                          <div className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground">
                            {nodeTypes.find(nt => nt.type === node.type)?.label}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">位置</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-muted-foreground">X: {Math.round(node.x)}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Y: {Math.round(node.y)}</span>
                            </div>
                          </div>
                        </div>
                        {node.type === 'ai-model' && (
                          <div>
                            <label className="text-sm font-medium text-foreground block mb-2">AI模型</label>
                            <select className="w-full h-9 px-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                              <option>肺结节检测模型</option>
                              <option>病理切片分析</option>
                              <option>医疗报告生成</option>
                            </select>
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDeleteNode(selectedNode)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除节点
                        </Button>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">选择一个节点查看属性</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
