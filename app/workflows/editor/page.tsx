'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip, Paper,
  TextField, IconButton, Tooltip, Divider, Accordion, AccordionSummary,
  AccordionDetails, FormControl, InputLabel, Select, MenuItem, Slider,
  Drawer
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SaveIcon from '@mui/icons-material/Save'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import GridOnIcon from '@mui/icons-material/GridOn'
import CircleIcon from '@mui/icons-material/Circle'
import BoltIcon from '@mui/icons-material/Bolt'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DeleteIcon from '@mui/icons-material/Delete'
import SettingsIcon from '@mui/icons-material/Settings'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LinkIcon from '@mui/icons-material/Link'
import TimerIcon from '@mui/icons-material/Timer'
import ApiIcon from '@mui/icons-material/Api'
import CloudIcon from '@mui/icons-material/Cloud'
import DataObjectIcon from '@mui/icons-material/DataObject'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

interface FlowNode {
  id: string
  type: string
  label: string
  x: number
  y: number
  config?: Record<string, any>
}

interface FlowConnection {
  id: string
  from: string
  to: string
}

const nodeTypes = [
  { type: 'start', label: '开始', icon: CircleIcon, color: '#f0fdf4', textColor: '#16a34a', inputs: 0, outputs: 1 },
  { type: 'end', label: '结束', icon: CircleIcon, color: '#f1f5f9', textColor: '#64748b', inputs: 1, outputs: 0 },
  { type: 'ai-model', label: 'AI模型调用', icon: BoltIcon, color: '#eff6ff', textColor: '#2563eb', inputs: 1, outputs: 1 },
  { type: 'transform', label: '数据转换', icon: CallSplitIcon, color: '#f5f3ff', textColor: '#7c3aed', inputs: 1, outputs: 1 },
  { type: 'condition', label: '条件判断', icon: CheckBoxIcon, color: '#fff7ed', textColor: '#ea580c', inputs: 1, outputs: 2 },
  { type: 'timer', label: '定时器', icon: TimerIcon, color: '#fef3c7', textColor: '#d97706', inputs: 0, outputs: 1 },
  { type: 'api', label: 'API调用', icon: ApiIcon, color: '#e0e7ff', textColor: '#4f46e5', inputs: 1, outputs: 1 },
  { type: 'cloud', label: '云存储', icon: CloudIcon, color: '#dbeafe', textColor: '#2563eb', inputs: 1, outputs: 1 },
  { type: 'data', label: '数据处理', icon: DataObjectIcon, color: '#fce7f3', textColor: '#db2777', inputs: 1, outputs: 1 },
  { type: 'notification', label: '通知', icon: NotificationsIcon, color: '#fce7f3', textColor: '#059669', inputs: 1, outputs: 0 },
]

const mockNodes: FlowNode[] = [
  { id: '1', type: 'start', label: '开始', x: 80, y: 250 },
  { id: '2', type: 'ai-model', label: '肺结节检测', x: 250, y: 250, config: { model: 'lung-nodule-v1', threshold: 0.5 } },
  { id: '3', type: 'condition', label: '结果判断', x: 480, y: 250, config: { condition: 'confidence > 0.8' } },
  { id: '4', type: 'ai-model', label: '良恶性判断', x: 680, y: 150, config: { model: 'benign-malignant-v1' } },
  { id: '5', type: 'notification', label: '发送通知', x: 680, y: 350, config: { type: 'email' } },
  { id: '6', type: 'end', label: '结束', x: 880, y: 250 },
]

const mockConnections: FlowConnection[] = [
  { id: 'c1', from: '1', to: '2' },
  { id: 'c2', from: '2', to: '3' },
  { id: 'c3', from: '3', to: '4' },
  { id: 'c4', from: '3', to: '5' },
  { id: 'c5', from: '4', to: '6' },
  { id: 'c6', from: '5', to: '6' },
]

export default function FlowEditorPage() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<FlowNode[]>(mockNodes)
  const [connections, setConnections] = useState<FlowConnection[]>(mockConnections)
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(true)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [nodeConfig, setNodeConfig] = useState<Record<string, any>>({})

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50))

  const getNodeType = (type: string) => nodeTypes.find(n => n.type === type)

  const handleNodeClick = (node: FlowNode) => {
    setSelectedNode(node)
    setNodeConfig(node.config || {})
    setPropertiesOpen(true)
  }

  const handleSaveConfig = () => {
    if (selectedNode) {
      setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, config: nodeConfig } : n))
    }
    setPropertiesOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8fafc' }}>
      {/* 顶部工具栏 */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, bgcolor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', px: 2, gap: 2, zIndex: 1000 }}>
        <IconButton component={Link} href="/workflows"><ArrowBackIcon /></IconButton>
        <Divider orientation="vertical" flexItem />
        <Typography variant="h6" fontWeight="bold">工作流编辑器</Typography>
        <Chip label="肺结节AI诊断流程 v1.2" size="small" color="primary" sx={{ ml: 1 }} />
        <Box sx={{ flex: 1 }} />
        <Tooltip title="撤销"><IconButton><UndoIcon /></IconButton></Tooltip>
        <Tooltip title="重做"><IconButton><RedoIcon /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="放大"><IconButton onClick={handleZoomIn}><ZoomInIcon /></IconButton></Tooltip>
        <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>{zoom}%</Typography>
        <Tooltip title="缩小"><IconButton onClick={handleZoomOut}><ZoomOutIcon /></IconButton></Tooltip>
        <Tooltip title="网格"><IconButton onClick={() => setShowGrid(!showGrid)}><GridOnIcon sx={{ color: showGrid ? '#2563eb' : 'inherit' }} /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem />
        <Button variant="outlined" startIcon={<PlayArrowIcon />}>测试运行</Button>
        <Button variant="contained" startIcon={<SaveIcon />} sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}>保存</Button>
      </Box>

      {/* 左侧节点面板 */}
      <Box sx={{ width: 260, bgcolor: 'white', borderRight: '1px solid #e2e8f0', mt: '56px', p: 2, overflow: 'auto' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>节点组件</Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>流程控制</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {nodeTypes.slice(0, 2).map((node) => (
            <Paper key={node.type} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f5f5f5', transform: 'translateX(4px)' } }}>
              <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: node.color }}><node.icon sx={{ fontSize: 18, color: node.textColor }} /></Box>
              <Typography variant="body2">{node.label}</Typography>
            </Paper>
          ))}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>AI节点</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {nodeTypes.slice(2, 5).map((node) => (
            <Paper key={node.type} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f5f5f5', transform: 'translateX(4px)' } }}>
              <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: node.color }}><node.icon sx={{ fontSize: 18, color: node.textColor }} /></Box>
              <Typography variant="body2">{node.label}</Typography>
            </Paper>
          ))}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>系统节点</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {nodeTypes.slice(5).map((node) => (
            <Paper key={node.type} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f5f5f5', transform: 'translateX(4px)' } }}>
              <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: node.color }}><node.icon sx={{ fontSize: 18, color: node.textColor }} /></Box>
              <Typography variant="body2">{node.label}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* 中间画布 */}
      <Box sx={{ flex: 1, mt: '56px', overflow: 'auto', position: 'relative' }}>
        <Box
          ref={canvasRef}
          sx={{
            position: 'relative',
            minWidth: 1200,
            minHeight: 600,
            height: 'calc(100vh - 56px)',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            bgcolor: showGrid ? '#fafafa' : 'white',
            backgroundImage: showGrid ? 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)' : 'none',
            backgroundSize: showGrid ? '20px 20px' : 'auto',
          }}
        >
          {/* 连接线 */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {connections.map((conn) => {
              const fromNode = nodes.find(n => n.id === conn.from)
              const toNode = nodes.find(n => n.id === conn.to)
              if (!fromNode || !toNode) return null
              const nodeType = getNodeType(fromNode.type)
              return (
                <path
                  key={conn.id}
                  d={`M ${fromNode.x + 120} ${fromNode.y + 25} C ${fromNode.x + 200} ${fromNode.y + 25}, ${toNode.x - 80} ${toNode.y + 25}, ${toNode.x} ${toNode.y + 25}`}
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              )
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>

          {/* 节点 */}
          {nodes.map((node) => {
            const nodeType = getNodeType(node.type)
            return (
              <Box
                key={node.id}
                onClick={() => handleNodeClick(node)}
                sx={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  bgcolor: nodeType?.color || '#fff',
                  borderRadius: 2,
                  boxShadow: selectedNode?.id === node.id ? 3 : 1,
                  cursor: 'pointer',
                  border: selectedNode?.id === node.id ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: 3 }
                }}
              >
                {nodeType && <nodeType.icon sx={{ fontSize: 20, color: nodeType.textColor }} />}
                <Typography variant="body2" fontWeight="medium">{node.label}</Typography>
                <IconButton size="small" sx={{ ml: 1 }} onClick={(e) => { e.stopPropagation(); setNodes(nodes.filter(n => n.id !== node.id)) }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* 右侧属性面板 */}
      <Drawer anchor="right" open={propertiesOpen} onClose={() => setPropertiesOpen(false)} PaperProps={{ sx: { width: 360, mt: '56px' } }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>节点配置</Typography>

          {selectedNode && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>基本信息</Typography>
                <TextField fullWidth size="small" label="节点名称" value={selectedNode.label} onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n))} sx={{ mb: 2 }} />
                <FormControl fullWidth size="small">
                  <InputLabel>节点类型</InputLabel>
                  <Select value={selectedNode.type} label="节点类型">
                    {nodeTypes.map(n => <MenuItem key={n.type} value={n.type}>{n.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>节点配置</Typography>

              {selectedNode.type === 'ai-model' && (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>AI模型</InputLabel>
                    <Select value={nodeConfig.model || ''} label="AI模型" onChange={(e) => setNodeConfig({ ...nodeConfig, model: e.target.value })}>
                      <MenuItem value="lung-nodule-v1">肺结节检测 v1</MenuItem>
                      <MenuItem value="benign-malignant-v1">良恶性判断 v1</MenuItem>
                      <MenuItem value="chest-xray-v1">胸部X光 v1</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary">置信度阈值</Typography>
                  <Slider
                    value={nodeConfig.threshold || 0.5}
                    onChange={(_, v) => setNodeConfig({ ...nodeConfig, threshold: v })}
                    min={0}
                    max={1}
                    step={0.1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              {selectedNode.type === 'condition' && (
                <TextField fullWidth size="small" label="条件表达式" value={nodeConfig.condition || ''} onChange={(e) => setNodeConfig({ ...nodeConfig, condition: e.target.value })} placeholder="如: confidence > 0.8" sx={{ mb: 2 }} />
              )}

              {selectedNode.type === 'notification' && (
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>通知方式</InputLabel>
                  <Select value={nodeConfig.type || 'email'} label="通知方式" onChange={(e) => setNodeConfig({ ...nodeConfig, type: e.target.value })}>
                    <MenuItem value="email">邮件</MenuItem>
                    <MenuItem value="sms">短信</MenuItem>
                    <MenuItem value="wechat">微信</MenuItem>
                    <MenuItem value="system">系统通知</MenuItem>
                  </Select>
                </FormControl>
              )}

              {selectedNode.type === 'timer' && (
                <>
                  <TextField fullWidth size="small" label="间隔(秒)" type="number" value={nodeConfig.interval || 60} onChange={(e) => setNodeConfig({ ...nodeConfig, interval: e.target.value })} sx={{ mb: 2 }} />
                </>
              )}

              {selectedNode.type === 'api' && (
                <>
                  <TextField fullWidth size="small" label="API地址" value={nodeConfig.url || ''} onChange={(e) => setNodeConfig({ ...nodeConfig, url: e.target.value })} sx={{ mb: 2 }} />
                  <FormControl fullWidth size="small">
                    <InputLabel>请求方式</InputLabel>
                    <Select value={nodeConfig.method || 'POST'} label="请求方式">
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button variant="contained" fullWidth onClick={handleSaveConfig}>保存配置</Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  )
}
