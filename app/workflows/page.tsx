'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import StopIcon from '@mui/icons-material/Stop'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'

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
}

const mockWorkflows: WorkflowItem[] = [
  { id: '1', name: '肺结节AI诊断流程', description: 'CT影像自动诊断工作流', version: 'v1.2', status: 'published', execStatus: 'running', nodeCount: 8, execCount: 1234, successRate: '96.5%', avgDuration: '15s', lastExec: '2024-01-19 10:30' },
  { id: '2', name: '报告自动生成流程', description: '诊断报告自动生成与审核', version: 'v2.0', status: 'published', execStatus: 'completed', nodeCount: 5, execCount: 856, successRate: '98.2%', avgDuration: '8s', lastExec: '2024-01-19 10:25' },
  { id: '3', name: '影像预处理流程', description: 'DICOM影像预处理pipeline', version: 'v1.0', status: 'draft', execStatus: 'pending', nodeCount: 4, execCount: 0, successRate: '-', avgDuration: '-', lastExec: '-' }
]

export default function WorkflowsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">工作流管理</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>设计和管理AI业务流程</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>新建工作流</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">工作流总数</Typography>
              <Typography variant="h4" fontWeight="bold">{mockWorkflows.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">运行中</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">{mockWorkflows.filter(w => w.execStatus === 'running').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">今日执行</Typography>
              <Typography variant="h4" fontWeight="bold">{mockWorkflows.reduce((a, w) => a + w.execCount, 0)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth size="small" placeholder="搜索工作流..." InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} /> }} />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>工作流名称</TableCell>
                  <TableCell>版本</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>执行状态</TableCell>
                  <TableCell>执行次数</TableCell>
                  <TableCell>成功率</TableCell>
                  <TableCell>平均耗时</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockWorkflows.map((wf) => (
                  <TableRow key={wf.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{wf.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{wf.description}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{wf.version}</TableCell>
                    <TableCell>
                      <Chip label={wf.status === 'published' ? '已发布' : wf.status === 'draft' ? '草稿' : '归档'} size="small" color={wf.status === 'published' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={wf.execStatus === 'running' ? '运行中' : wf.execStatus === 'completed' ? '已完成' : wf.execStatus === 'failed' ? '失败' : wf.execStatus === 'paused' ? '已暂停' : '等待中'}
                        size="small"
                        color={wf.execStatus === 'running' ? 'primary' : wf.execStatus === 'completed' ? 'success' : wf.execStatus === 'failed' ? 'error' : wf.execStatus === 'paused' ? 'warning' : 'default'}
                        icon={wf.execStatus === 'running' ? <HourglassEmptyIcon /> : wf.execStatus === 'completed' ? <CheckCircleIcon /> : wf.execStatus === 'failed' ? <ErrorIcon /> : undefined}
                      />
                    </TableCell>
                    <TableCell>{wf.execCount}</TableCell>
                    <TableCell>{wf.successRate}</TableCell>
                    <TableCell>{wf.avgDuration}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><PlayArrowIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><PauseIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}
