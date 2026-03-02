'use client'

import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MemoryIcon from '@mui/icons-material/Memory'
import StorageIcon from '@mui/icons-material/Storage'
import DnsIcon from '@mui/icons-material/Dns'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningIcon from '@mui/icons-material/Warning'

export default function MonitoringPage() {
  const [alerts] = useState([
    { id: '1', name: 'CPU使用率告警', metric: 'CPU', threshold: '80%', current: '45%', status: 'normal' },
    { id: '2', name: '内存使用告警', metric: 'Memory', threshold: '85%', current: '92%', status: 'critical' },
    { id: '3', name: 'AI响应超时', metric: 'ResponseTime', threshold: '5s', current: '6.2s', status: 'warning' }
  ])

  const [cpuHistory, setCpuHistory] = useState<number[]>([42, 45, 43, 48, 45, 47, 45, 46, 44, 45])
  const [memoryHistory, setMemoryHistory] = useState<number[]>([88, 89, 90, 91, 92, 91, 92, 92, 91, 92])
  const [networkHistory, setNetworkHistory] = useState<number[]>([35, 38, 36, 40, 38, 42, 38, 39, 37, 38])

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuHistory(prev => [...prev.slice(1), 40 + Math.random() * 10])
      setMemoryHistory(prev => [...prev.slice(1), 88 + Math.random() * 6])
      setNetworkHistory(prev => [...prev.slice(1), 35 + Math.random() * 8])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">监控告警</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>实时监控系统状态和告警规则管理</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>新建告警规则</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">CPU使用率</Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>45%</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f0fdf4' }}>
                  <MemoryIcon sx={{ color: 'success.main', fontSize: 32 }} />
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
                  <Typography variant="body2" color="text.secondary">内存使用</Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>92%</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fef2f2' }}>
                  <StorageIcon sx={{ color: 'error.main', fontSize: 32 }} />
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
                  <Typography variant="body2" color="text.secondary">网络带宽</Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>38%</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#eff6ff' }}>
                  <DnsIcon sx={{ color: 'primary.main', fontSize: 32 }} />
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
                  <Typography variant="body2" color="text.secondary">活跃连接</Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>1,284</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f5f3ff' }}>
                  <TrendingUpIcon sx={{ color: '#7c3aed', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>告警列表</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>告警名称</TableCell>
                      <TableCell>指标</TableCell>
                      <TableCell>阈值</TableCell>
                      <TableCell>当前值</TableCell>
                      <TableCell>状态</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id} hover>
                        <TableCell>{alert.name}</TableCell>
                        <TableCell>{alert.metric}</TableCell>
                        <TableCell>{alert.threshold}</TableCell>
                        <TableCell>{alert.current}</TableCell>
                        <TableCell>
                          <Chip
                            label={alert.status === 'normal' ? '正常' : alert.status === 'critical' ? '严重' : '警告'}
                            size="small"
                            color={alert.status === 'normal' ? 'success' : alert.status === 'critical' ? 'error' : 'warning'}
                            icon={alert.status !== 'normal' ? <WarningIcon /> : undefined}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>资源趋势</Typography>
              {['CPU', '内存', '网络'].map((metric, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{metric}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {idx === 0 ? cpuHistory[9].toFixed(0) : idx === 1 ? memoryHistory[9].toFixed(0) : networkHistory[9].toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={idx === 0 ? cpuHistory[9] : idx === 1 ? memoryHistory[9] : networkHistory[9]}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: idx === 1 ? 'error.main' : 'primary.main'
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
