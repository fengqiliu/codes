'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip, Paper
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SaveIcon from '@mui/icons-material/Save'
import CircleIcon from '@mui/icons-material/Circle'
import BoltIcon from '@mui/icons-material/Bolt'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DeleteIcon from '@mui/icons-material/Delete'

interface FlowNode {
  id: string
  type: 'start' | 'ai-model' | 'transform' | 'condition' | 'end'
  label: string
  x: number
  y: number
}

const nodeTypes = [
  { type: 'start', label: '开始', icon: CircleIcon, color: '#f0fdf4', textColor: '#16a34a' },
  { type: 'ai-model', label: 'AI模型调用', icon: BoltIcon, color: '#eff6ff', textColor: '#2563eb' },
  { type: 'transform', label: '数据转换', icon: CallSplitIcon, color: '#f5f3ff', textColor: '#7c3aed' },
  { type: 'condition', label: '条件判断', icon: CheckBoxIcon, color: '#fff7ed', textColor: '#ea580c' },
  { type: 'end', label: '结束', icon: CircleIcon, color: '#f1f5f9', textColor: '#64748b' }
]

export default function FlowEditorPage() {
  const [nodes] = useState<FlowNode[]>([
    { id: '1', type: 'start', label: '开始', x: 100, y: 200 },
    { id: '2', type: 'ai-model', label: '肺结节检测', x: 300, y: 200 },
    { id: '3', type: 'condition', label: '结果判断', x: 500, y: 200 },
    { id: '4', type: 'end', label: '结束', x: 700, y: 200 }
  ])

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">工作流编辑器</Typography>
          <Typography variant="body2" color="text.secondary">肺结节AI诊断流程 - v1.2</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<PlayArrowIcon />}>测试运行</Button>
          <Button variant="contained" startIcon={<SaveIcon />}>保存</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>节点组件</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {nodeTypes.map((node) => (
                  <Paper
                    key={node.type}
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: node.color }}>
                      <node.icon sx={{ fontSize: 18, color: node.textColor }} />
                    </Box>
                    <Typography variant="body2">{node.label}</Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: 400, bgcolor: '#fafafa' }}>
              {nodes.map((node, idx) => {
                const nodeType = nodeTypes.find(n => n.type === node.type)
                return (
                  <Box
                    key={node.id}
                    sx={{
                      position: 'absolute',
                      left: node.x,
                      top: node.y,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      bgcolor: nodeType?.color || '#fff',
                      borderRadius: 2,
                      boxShadow: 1,
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 2 }
                    }}
                  >
                    {nodeType && <nodeType.icon sx={{ fontSize: 20, color: nodeType.textColor }} />}
                    <Typography variant="body2" fontWeight="medium">{node.label}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
