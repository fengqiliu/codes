'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Card, CardContent, Grid, Chip, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tabs, Tab, Button, Avatar, Tooltip, Badge
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MemoryIcon from '@mui/icons-material/Memory'
import StorageIcon from '@mui/icons-material/Storage'
import DnsIcon from '@mui/icons-material/Dns'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import RefreshIcon from '@mui/icons-material/Refresh'
import SpeedIcon from '@mui/icons-material/Speed'
import TimelineIcon from '@mui/icons-material/Timeline'
import ApiIcon from '@mui/icons-material/Api'
import PsychologyIcon from '@mui/icons-material/Psychology'
import PeopleIcon from '@mui/icons-material/People'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

interface MetricData {
  value: number
  history: number[]
}

interface Alert {
  id: string
  name: string
  metric: string
  threshold: string
  current: string
  status: 'normal' | 'warning' | 'critical'
  time: string
}

interface ApiMetric {
  name: string
  calls: number
  avgTime: string
  successRate: string
}

interface ModelMetric {
  name: string
  calls: number
  avgLatency: string
  status: 'online' | 'offline' | 'degraded'
}

const mockAlerts: Alert[] = [
  { id: '1', name: 'CPU使用率告警', metric: 'CPU', threshold: '80%', current: '45%', status: 'normal', time: '2024-01-19 10:30' },
  { id: '2', name: '内存使用告警', metric: 'Memory', threshold: '85%', current: '92%', status: 'critical', time: '2024-01-19 10:28' },
  { id: '3', name: 'AI响应超时', metric: 'ResponseTime', threshold: '5s', current: '6.2s', status: 'warning', time: '2024-01-19 10:25' },
  { id: '4', name: '磁盘空间不足', metric: 'Disk', threshold: '90%', current: '88%', status: 'warning', time: '2024-01-19 10:20' },
]

const mockApiMetrics: ApiMetric[] = [
  { name: '/api/ai/diagnosis', calls: 12543, avgTime: '186ms', successRate: '99.5%' },
  { name: '/api/ai/report', calls: 8921, avgTime: '245ms', successRate: '99.2%' },
  { name: '/api/images/upload', calls: 3421, avgTime: '1.2s', successRate: '98.8%' },
  { name: '/api/auth/login', calls: 5621, avgTime: '45ms', successRate: '99.9%' },
  { name: '/api/collaboration', calls: 2134, avgTime: '89ms', successRate: '99.7%' },
]

const mockModelMetrics: ModelMetric[] = [
  { name: '肺结节检测', calls: 8932, avgLatency: '125ms', status: 'online' },
  { name: '报告生成', calls: 5621, avgLatency: '2.3s', status: 'online' },
  { name: '病灶分割', calls: 3421, avgLatency: '380ms', status: 'degraded' },
  { name: '病理分析', calls: 1234, avgLatency: '5.2s', status: 'online' },
]

const servers = [
  { name: 'API Server-1', ip: '192.168.1.10', status: 'online', cpu: 45, memory: 62 },
  { name: 'API Server-2', ip: '192.168.1.11', status: 'online', cpu: 52, memory: 58 },
  { name: 'AI Inference-1', ip: '192.168.1.20', status: 'online', cpu: 78, memory: 85 },
  { name: 'AI Inference-2', ip: '192.168.1.21', status: 'online', cpu: 65, memory: 72 },
  { name: 'Database Primary', ip: '192.168.1.30', status: 'online', cpu: 32, memory: 45 },
  { name: 'Database Replica', ip: '192.168.1.31', status: 'offline', cpu: 0, memory: 0 },
]

// 简单折线图组件
function MiniChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    const max = Math.max(...data, 100)
    ctx.clearRect(0, 0, w, h)
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - (v / max) * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [data, color])
  return <canvas ref={canvasRef} width={100} height={height} style={{ width: '100%' }} />
}

export default function MonitoringPage() {
  const [tabValue, setTabValue] = useState(0)
  const [cpu, setCpu] = useState<MetricData>({ value: 45, history: Array(20).fill(45) })
  const [memory, setMemory] = useState<MetricData>({ value: 72, history: Array(20).fill(72) })
  const [network, setNetwork] = useState<MetricData>({ value: 38, history: Array(20).fill(38) })
  const [disk, setDisk] = useState<MetricData>({ value: 65, history: Array(20).fill(65) })
  const [apiCalls, setApiCalls] = useState<MetricData>({ value: 1256, history: Array(20).fill(1200) })
  const [activeUsers, setActiveUsers] = useState<MetricData>({ value: 342, history: Array(20).fill(340) })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => ({
        value: 40 + Math.random() * 20,
        history: [...prev.history.slice(1), 40 + Math.random() * 20]
      }))
      setMemory(prev => ({
        value: 65 + Math.random() * 15,
        history: [...prev.history.slice(1), 65 + Math.random() * 15]
      }))
      setNetwork(prev => ({
        value: 30 + Math.random() * 25,
        history: [...prev.history.slice(1), 30 + Math.random() * 25]
      }))
      setDisk(prev => ({
        value: 60 + Math.random() * 10,
        history: [...prev.history.slice(1), 60 + Math.random() * 10]
      }))
      setApiCalls(prev => ({
        value: 1000 + Math.random() * 500,
        history: [...prev.history.slice(1), 1000 + Math.random() * 500]
      }))
      setActiveUsers(prev => ({
        value: 300 + Math.random() * 100,
        history: [...prev.history.slice(1), 300 + Math.random() * 100]
      }))
      setCurrentTime(new Date())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    if (status === 'online' || status === 'normal') return 'success'
    if (status === 'degraded' || status === 'warning') return 'warning'
    return 'error'
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white' }}>
      {/* 顶部导航 */}
      <Box sx={{ bgcolor: '#1e293b', px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">系统监控大屏</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>实时监控系统运行状态</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip label={currentTime.toLocaleTimeString()} size="small" sx={{ bgcolor: '#334155' }} />
          <Tooltip title="刷新"><IconButton sx={{ color: 'white' }}><RefreshIcon /></IconButton></Tooltip>
          <Tooltip title="设置"><IconButton sx={{ color: 'white' }}><SettingsIcon /></IconButton></Tooltip>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* 统计卡片 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>CPU 使用率</Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>{cpu.value.toFixed(0)}%</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingDownIcon sx={{ fontSize: 14, color: '#22c55e', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#22c55e' }}>-2.3%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: cpu.value > 80 ? '#ef444420' : '#22c55e20' }}>
                    <MemoryIcon sx={{ color: cpu.value > 80 ? '#ef4444' : '#22c55e' }} />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <MiniChart data={cpu.history} color="#22c55e" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>内存使用</Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>{memory.value.toFixed(0)}%</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#ef4444', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#ef4444' }}>+5.2%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: memory.value > 85 ? '#ef444420' : '#3b82f620' }}>
                    <StorageIcon sx={{ color: memory.value > 85 ? '#ef4444' : '#3b82f6' }} />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <MiniChart data={memory.history} color="#3b82f6" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>API 调用/秒</Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>{apiCalls.value.toFixed(0)}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#22c55e', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#22c55e' }}>+12.5%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#8b5cf620' }}>
                    <ApiIcon sx={{ color: '#8b5cf6' }} />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <MiniChart data={apiCalls.history} color="#8b5cf6" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>在线用户</Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>{activeUsers.value.toFixed(0)}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#22c55e', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#22c55e' }}>+8.3%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f59e0b20' }}>
                    <PeopleIcon sx={{ color: '#f59e0b' }} />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <MiniChart data={activeUsers.history} color="#f59e0b" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* 告警列表 */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsActiveIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="h6" fontWeight="bold">实时告警</Typography>
                    <Chip label={mockAlerts.filter(a => a.status !== 'normal').length} size="small" color="error" />
                  </Box>
                  <Button size="small" sx={{ color: '#94a3b8' }}>查看全部</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {mockAlerts.map((alert) => (
                    <Box key={alert.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1, bgcolor: alert.status === 'critical' ? '#ef444420' : alert.status === 'warning' ? '#f59e0b20' : '#22c55e20' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {alert.status === 'normal' ? <CheckCircleIcon sx={{ color: '#22c55e' }} /> : alert.status === 'critical' ? <ErrorIcon sx={{ color: '#ef4444' }} /> : <WarningIcon sx={{ color: '#f59e0b' }} />}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{alert.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>{alert.time}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="bold">{alert.current}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>阈值: {alert.threshold}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 服务器状态 */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudQueueIcon sx={{ color: '#3b82f6' }} />
                    <Typography variant="h6" fontWeight="bold">服务器状态</Typography>
                    <Chip label={servers.filter(s => s.status === 'online').length + '/' + servers.length} size="small" color="success" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {servers.map((server, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1, bgcolor: '#0f172a' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: server.status === 'online' ? '#22c55e' : server.status === 'degraded' ? '#f59e0b' : '#ef4444' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{server.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>{server.ip}</Typography>
                        </Box>
                      </Box>
                      {server.status !== 'offline' && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>CPU</Typography>
                            <Typography variant="body2" fontWeight="bold">{server.cpu}%</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>MEM</Typography>
                            <Typography variant="body2" fontWeight="bold">{server.memory}%</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* API 性能 */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TimelineIcon sx={{ color: '#8b5cf6' }} />
                  <Typography variant="h6" fontWeight="bold">API 性能</Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#94a3b8', borderColor: '#334155' }}>API</TableCell>
                        <TableCell sx={{ color: '#94a3b8', borderColor: '#334155' }}>调用次数</TableCell>
                        <TableCell sx={{ color: '#94a3b8', borderColor: '#334155' }}>平均耗时</TableCell>
                        <TableCell sx={{ color: '#94a3b8', borderColor: '#334155' }}>成功率</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockApiMetrics.map((api, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ borderColor: '#334155' }}>{api.name}</TableCell>
                          <TableCell sx={{ borderColor: '#334155' }}>{api.calls.toLocaleString()}</TableCell>
                          <TableCell sx={{ borderColor: '#334155' }}>{api.avgTime}</TableCell>
                          <TableCell sx={{ borderColor: '#334155' }}>
                            <Chip label={api.successRate} size="small" sx={{ bgcolor: parseFloat(api.successRate) > 99 ? '#22c55e20' : '#f59e0b20', color: parseFloat(api.successRate) > 99 ? '#22c55e' : '#f59e0b' }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* AI 模型状态 */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PsychologyIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6" fontWeight="bold">AI 模型状态</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockModelMetrics.map((model, idx) => (
                    <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#0f172a' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PsychologyIcon sx={{ color: model.status === 'online' ? '#22c55e' : model.status === 'degraded' ? '#f59e0b' : '#ef4444', fontSize: 20 }} />
                          <Typography variant="body1" fontWeight="medium">{model.name}</Typography>
                        </Box>
                        <Chip label={model.status === 'online' ? '在线' : model.status === 'degraded' ? '降级' : '离线'} size="small" color={getStatusColor(model.status) as any} />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>调用次数</Typography>
                          <Typography variant="body2" fontWeight="bold">{model.calls.toLocaleString()}</Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>平均延迟</Typography>
                          <Typography variant="body2" fontWeight="bold">{model.avgLatency}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
