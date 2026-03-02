'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, Tabs, Tab,
  Avatar, LinearProgress, Divider, Tooltip
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import HistoryIcon from '@mui/icons-material/History'
import SettingsIcon from '@mui/icons-material/Settings'
import Link from 'next/link'

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
  author: string
  tags: string[]
}

interface ExecutionLog {
  id: string
  workflowId: string
  workflowName: string
  startTime: string
  endTime: string
  duration: string
  status: 'success' | 'failed' | 'running'
  triggerType: 'manual' | 'scheduled' | 'api'
}

const mockWorkflows: WorkflowItem[] = [
  { id: '1', name: '肺结节AI诊断流程', description: 'CT影像自动诊断工作流', version: 'v1.2', status: 'published', execStatus: 'running', nodeCount: 8, execCount: 1234, successRate: '96.5%', avgDuration: '15s', lastExec: '2024-01-19 10:30', author: '李医生', tags: ['AI诊断', 'CT'] },
  { id: '2', name: '报告自动生成流程', description: '诊断报告自动生成与审核', version: 'v2.0', status: 'published', execStatus: 'completed', nodeCount: 5, execCount: 856, successRate: '98.2%', avgDuration: '8s', lastExec: '2024-01-19 10:25', author: '王医生', tags: ['报告', '自动化'] },
  { id: '3', name: '影像预处理流程', description: 'DICOM影像预处理pipeline', version: 'v1.0', status: 'draft', execStatus: 'pending', nodeCount: 4, execCount: 0, successRate: '-', avgDuration: '-', lastExec: '-', author: '张医生', tags: ['预处理', 'DICOM'] },
  { id: '4', name: '多学科会诊流程', description: 'MDT会诊自动安排与通知', version: 'v1.1', status: 'published', execStatus: 'completed', nodeCount: 6, execCount: 234, successRate: '95.8%', avgDuration: '12s', lastExec: '2024-01-18 16:20', author: '李医生', tags: ['会诊', '通知'] },
  { id: '5', name: '病理切片分析流程', description: '病理AI辅助分析工作流', version: 'v0.9', status: 'archived', execStatus: 'failed', nodeCount: 7, execCount: 56, successRate: '87.5%', avgDuration: '45s', lastExec: '2024-01-15 09:00', author: '赵医生', tags: ['病理', 'AI分析'] },
]

const mockExecutionLogs: ExecutionLog[] = [
  { id: '1', workflowId: '1', workflowName: '肺结节AI诊断流程', startTime: '2024-01-19 10:30:00', endTime: '2024-01-19 10:30:15', duration: '15s', status: 'success', triggerType: 'manual' },
  { id: '2', workflowId: '2', workflowName: '报告自动生成流程', startTime: '2024-01-19 10:25:00', endTime: '2024-01-19 10:25:08', duration: '8s', status: 'success', triggerType: 'scheduled' },
  { id: '3', workflowId: '1', workflowName: '肺结节AI诊断流程', startTime: '2024-01-19 09:15:00', endTime: '2024-01-19 09:15:18', duration: '18s', status: 'failed', triggerType: 'api' },
  { id: '4', workflowId: '4', workflowName: '多学科会诊流程', startTime: '2024-01-18 16:20:00', endTime: '2024-01-18 16:20:12', duration: '12s', status: 'success', triggerType: 'manual' },
]

export default function WorkflowsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null)

  const getStatusChip = (status: string, execStatus?: string) => {
    if (status === 'published') {
      return <Chip label="已发布" size="small" color="success" />
    } else if (status === 'draft') {
      return <Chip label="草稿" size="small" color="warning" />
    } else {
      return <Chip label="归档" size="small" />
    }
  }

  const getExecStatusChip = (execStatus: string) => {
    const config: Record<string, { label: string; color: 'primary' | 'success' | 'error' | 'warning' | 'default' }> = {
      running: { label: '运行中', color: 'primary' },
      completed: { label: '已完成', color: 'success' },
      failed: { label: '失败', color: 'error' },
      paused: { label: '已暂停', color: 'warning' },
      pending: { label: '等待中', color: 'default' },
    }
    const c = config[execStatus] || config.pending
    return <Chip label={c.label} size="small" color={c.color} />
  }

  const filteredWorkflows = mockWorkflows.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewDetails = (workflow: WorkflowItem) => {
    setSelectedWorkflow(workflow)
    setDetailDialogOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* 侧边栏 */}
      <Box sx={{ width: 260, bgcolor: 'white', borderRight: '1px solid #e2e8f0', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2, mb: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AccountTreeIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">医学影像AI</Typography>
            <Typography variant="caption" color="text.secondary">集成平台 V2.0</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          {[
            { name: '控制台', icon: '📊', path: '/' },
            { name: '影像管理', icon: '🖼️', path: '/images' },
            { name: '诊断协作', icon: '👥', path: '/collaboration' },
            { name: '权限管理', icon: '🔒', path: '/permissions' },
            { name: 'AI模型管理', icon: '🤖', path: '/models' },
            { name: '流程编排', icon: '🔀', path: '/workflows', active: true },
            { name: '用户管理', icon: '👤', path: '/users' },
            { name: 'API网关', icon: '🌐', path: '/gateway' },
            { name: '系统监控', icon: '📈', path: '/monitoring' },
            { name: '日志审计', icon: '📝', path: '/audit' },
            { name: '系统设置', icon: '⚙️', path: '/settings' },
          ].map((item) => (
            <Box key={item.name} component={Link} href={item.path} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderRadius: 2, textDecoration: 'none', color: item.active ? 'white' : 'text.primary', bgcolor: item.active ? 'primary.main' : 'transparent', mb: 0.5 }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <Typography variant="body2" fontWeight={item.active ? '600' : '400'}>{item.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 主内容区 */}
      <Box sx={{ flex: 1 }}>
        {/* 顶部导航 */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">流程编排</Typography>
            <Typography variant="body2" color="text.secondary">设计和管理AI业务流程</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<CloudUploadIcon />}>导入</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>导出</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>新建工作流</Button>
          </Box>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          {/* 统计卡片 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card><CardContent>
                <Typography variant="body2" color="text.secondary">工作流总数</Typography>
                <Typography variant="h4" fontWeight="bold">{mockWorkflows.length}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card><CardContent>
                <Typography variant="body2" color="text.secondary">运行中</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">{mockWorkflows.filter(w => w.execStatus === 'running').length}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card><CardContent>
                <Typography variant="body2" color="text.secondary">今日执行</Typography>
                <Typography variant="h4" fontWeight="bold">{mockWorkflows.reduce((a, w) => a + w.execCount, 0)}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card><CardContent>
                <Typography variant="body2" color="text.secondary">平均成功率</Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">94.2%</Typography>
              </CardContent></Card>
            </Grid>
          </Grid>

          {/* 标签页 */}
          <Card>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tab label="全部工作流" />
              <Tab label="运行中" />
              <Tab label="执行历史" />
              <Tab label="模板市场" />
            </Tabs>

            {/* 搜索栏 */}
            <Box sx={{ p: 2, pb: 0 }}>
              <TextField
                fullWidth size="small" placeholder="搜索工作流..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
                sx={{ maxWidth: 400 }}
              />
            </Box>

            {/* 工作流列表 */}
            {tabValue === 0 && (
              <TableContainer>
                <Table>
                  <TableHead><TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell>工作流名称</TableCell>
                    <TableCell>版本</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>执行状态</TableCell>
                    <TableCell>执行次数</TableCell>
                    <TableCell>成功率</TableCell>
                    <TableCell>平均耗时</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {filteredWorkflows.map((wf) => (
                      <TableRow key={wf.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{wf.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{wf.description}</Typography>
                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                              {wf.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" sx={{ fontSize: 10, height: 18 }} />
                              ))}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={wf.version} size="small" variant="outlined" /></TableCell>
                        <TableCell>{getStatusChip(wf.status)}</TableCell>
                        <TableCell>{getExecStatusChip(wf.execStatus)}</TableCell>
                        <TableCell>{wf.execCount}</TableCell>
                        <TableCell>{wf.successRate}</TableCell>
                        <TableCell>{wf.avgDuration}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="运行"><IconButton size="small"><PlayArrowIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="暂停"><IconButton size="small"><PauseIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="编辑"><IconButton size="small" component={Link} href="/workflows/editor"><EditIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="详情"><IconButton size="small" onClick={() => handleViewDetails(wf)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="删除"><IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* 运行中 */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                {mockWorkflows.filter(w => w.execStatus === 'running').map((wf) => (
                  <Card key={wf.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6">{wf.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{wf.description}</Typography>
                        </Box>
                        <Chip label="运行中" color="primary" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">进度</Typography>
                            <Typography variant="caption">65%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                        <Button size="small" color="error" startIcon={<StopIcon />}>停止</Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* 执行历史 */}
            {tabValue === 2 && (
              <TableContainer>
                <Table>
                  <TableHead><TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell>工作流</TableCell>
                    <TableCell>触发方式</TableCell>
                    <TableCell>开始时间</TableCell>
                    <TableCell>耗时</TableCell>
                    <TableCell>状态</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {mockExecutionLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">{log.workflowName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={log.triggerType === 'manual' ? '手动' : log.triggerType === 'scheduled' ? '定时' : 'API'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{log.startTime}</TableCell>
                        <TableCell>{log.duration}</TableCell>
                        <TableCell>
                          <Chip label={log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '运行中'} size="small" color={log.status === 'success' ? 'success' : log.status === 'failed' ? 'error' : 'primary'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* 模板市场 */}
            {tabValue === 3 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {[
                    { name: '通用AI诊断流程', desc: '适用于多种影像的AI诊断', downloads: 156 },
                    { name: '胸部CT筛查流程', desc: '胸部CT自动筛查与报告', downloads: 89 },
                    { name: '报告审核流程', desc: 'AI报告自动审核与校对', downloads: 67 },
                    { name: '影像质控流程', desc: 'DICOM影像质量控制', downloads: 45 },
                  ].map((template, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Card sx={{ transition: 'all 0.2s', '&:hover': { boxShadow: 3 } }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">{template.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{template.desc}</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">{template.downloads} 次使用</Typography>
                            <Button size="small" variant="outlined">使用模板</Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* 创建工作流对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle><Typography variant="h6" fontWeight="bold">新建工作流</Typography></DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField fullWidth label="工作流名称" placeholder="请输入工作流名称" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="描述" multiline rows={2} placeholder="请输入工作流描述" />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>模板</InputLabel>
                <Select label="模板" defaultValue="">
                  <MenuItem value="blank">空白工作流</MenuItem>
                  <MenuItem value="ai-diagnosis">AI诊断流程</MenuItem>
                  <MenuItem value="report">报告生成流程</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>分类</InputLabel>
                <Select label="分类" defaultValue="">
                  <MenuItem value="diagnosis">诊断</MenuItem>
                  <MenuItem value="report">报告</MenuItem>
                  <MenuItem value="preprocess">预处理</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button variant="contained" component={Link} href="/workflows/editor" sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}>创建并编辑</Button>
        </DialogActions>
      </Dialog>

      {/* 工作流详情对话框 */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">工作流详情</Typography>
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <Typography variant="h5">{selectedWorkflow.name}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedWorkflow.description}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">版本</Typography>
                <Typography variant="body1">{selectedWorkflow.version}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">状态</Typography>
                {getStatusChip(selectedWorkflow.status)}
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">节点数</Typography>
                <Typography variant="body1">{selectedWorkflow.nodeCount}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">执行次数</Typography>
                <Typography variant="body1">{selectedWorkflow.execCount}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">成功率</Typography>
                <Typography variant="body1">{selectedWorkflow.successRate}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">平均耗时</Typography>
                <Typography variant="body1">{selectedWorkflow.avgDuration}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary">创建人</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{selectedWorkflow.author[0]}</Avatar>
                  <Typography variant="body1">{selectedWorkflow.author}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)}>关闭</Button>
          <Button variant="contained" startIcon={<EditIcon />}>编辑</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
