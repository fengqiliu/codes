'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PsychologyIcon from '@mui/icons-material/Psychology'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DescriptionIcon from '@mui/icons-material/Description'
import MicIcon from '@mui/icons-material/Mic'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SettingsIcon from '@mui/icons-material/Settings'
import EditIcon from '@mui/icons-material/Edit'

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
    icon: VisibilityIcon
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
    icon: DescriptionIcon
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
    icon: ImageIcon
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
    icon: MicIcon
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
    icon: VisibilityIcon
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
    icon: VisibilityIcon
  }
]

const typeLabels: Record<string, string> = {
  LLM: '大语言模型',
  IMAGE: '影像诊断',
  VOICE: '语音服务',
  CUSTOM: '自定义'
}

const typeColors: Record<string, 'primary' | 'secondary' | 'default' | 'error' | 'info'> = {
  LLM: 'secondary',
  IMAGE: 'primary',
  VOICE: 'info',
  CUSTOM: 'default'
}

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.modelId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || model.type === filterType
    const matchesStatus = !filterStatus || model.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <Box sx={{ p: 3 }}>
      {/* 页面标题 */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">AI模型管理</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>管理和监控已接入的AI模型</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
        >
          接入新模型
        </Button>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">总模型数</Typography>
                  <Typography variant="h4" fontWeight="bold">{models.length}</Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eff6ff' }}>
                  <PsychologyIcon sx={{ color: 'primary.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">在线模型</Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {models.filter(m => m.status === 'ONLINE').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f0fdf4' }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">维护中</Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {models.filter(m => m.status === 'MAINTENANCE').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fff7ed' }}>
                  <AccessTimeIcon sx={{ color: 'warning.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">今日总调用</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {models.reduce((acc, m) => acc + m.todayCalls, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f5f3ff' }}>
                  <TrendingUpIcon sx={{ color: '#7c3aed' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 搜索和筛选 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="搜索模型名称或ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>全部类型</InputLabel>
                <Select
                  value={filterType}
                  label="全部类型"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="">全部类型</MenuItem>
                  <MenuItem value="LLM">大语言模型</MenuItem>
                  <MenuItem value="IMAGE">影像诊断</MenuItem>
                  <MenuItem value="VOICE">语音服务</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>全部状态</InputLabel>
                <Select
                  value={filterStatus}
                  label="全部状态"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">全部状态</MenuItem>
                  <MenuItem value="ONLINE">在线</MenuItem>
                  <MenuItem value="OFFLINE">离线</MenuItem>
                  <MenuItem value="MAINTENANCE">维护中</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 模型列表 */}
      <Grid container spacing={2}>
        {filteredModels.map((model) => (
          <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={model.id}>
            <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eff6ff' }}>
                      <model.icon sx={{ color: 'primary.main', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{model.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{model.modelId}</Typography>
                    </Box>
                  </Box>
                  <Button size="small" sx={{ minWidth: 'auto', p: 0.5 }}>
                    <MoreVertIcon />
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>{model.description}</Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={typeLabels[model.type]} size="small" color={typeColors[model.type]} />
                  <Chip label={`v${model.version}`} size="small" variant="outlined" />
                  <Chip
                    label={model.status === 'ONLINE' ? '运行中' : model.status === 'MAINTENANCE' ? '维护中' : '已下线'}
                    size="small"
                    color={model.status === 'ONLINE' ? 'success' : model.status === 'MAINTENANCE' ? 'warning' : 'default'}
                  />
                </Box>

                <Grid container sx={{ py: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Grid size={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">{model.todayCalls.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">今日调用</Typography>
                  </Grid>
                  <Grid size={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">{model.avgResponseTime}ms</Typography>
                    <Typography variant="caption" color="text.secondary">响应时间</Typography>
                  </Grid>
                  <Grid size={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">{model.accuracy}%</Typography>
                    <Typography variant="caption" color="text.secondary">准确率</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {model.status === 'ONLINE' ? (
                    <Button variant="outlined" size="small" startIcon={<PauseIcon />} sx={{ flex: 1 }}>
                      暂停
                    </Button>
                  ) : (
                    <Button variant="outlined" size="small" startIcon={<PlayArrowIcon />} sx={{ flex: 1 }}>
                      启动
                    </Button>
                  )}
                  <Button variant="outlined" size="small" startIcon={<SettingsIcon />} sx={{ flex: 1 }}>
                    配置
                  </Button>
                  <Button variant="text" size="small">
                    <EditIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredModels.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <PsychologyIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>没有找到匹配的模型</Typography>
        </Box>
      )}
    </Box>
  )
}
