'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import DescriptionIcon from '@mui/icons-material/Description'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

export default function AuditPage() {
  const [logs] = useState([
    { id: '1', user: '张医生', action: '登录系统', type: 'security', time: '2024-01-19 10:23:15', ip: '192.168.1.100', status: 'success' },
    { id: '2', user: '李护士', action: '查询患者影像', type: 'business', time: '2024-01-19 10:20:08', ip: '192.168.1.101', status: 'success' },
    { id: '3', user: '王主任', action: '修改系统配置', type: 'operation', time: '2024-01-19 10:15:42', ip: '192.168.1.102', status: 'success' },
    { id: '4', user: '未知用户', action: '尝试访问管理接口', type: 'security', time: '2024-01-19 10:10:30', ip: '203.0.113.45', status: 'failed' }
  ])

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">日志审计</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>查询和分析系统操作日志</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>导出日志</Button>
          <Button variant="outlined" startIcon={<FilterListIcon />}>筛选</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">今日操作</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>1,248</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#eff6ff' }}>
                  <DescriptionIcon sx={{ color: 'primary.main', fontSize: 28 }} />
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
                  <Typography variant="body2" color="text.secondary">在线用户</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>24</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f0fdf4' }}>
                  <PersonIcon sx={{ color: 'success.main', fontSize: 28 }} />
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
                  <Typography variant="body2" color="text.secondary">安全事件</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>3</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fff7ed' }}>
                  <SecurityIcon sx={{ color: 'warning.main', fontSize: 28 }} />
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
                  <Typography variant="body2" color="text.secondary">异常操作</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>1</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fef2f2' }}>
                  <CancelIcon sx={{ color: 'error.main', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索日志..."
              InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} /> }}
            />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>用户</TableCell>
                  <TableCell>操作</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>时间</TableCell>
                  <TableCell>IP地址</TableCell>
                  <TableCell>状态</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.type === 'security' ? '安全' : log.type === 'business' ? '业务' : '操作'}
                        size="small"
                        color={log.type === 'security' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.status === 'success' ? '成功' : '失败'}
                        size="small"
                        color={log.status === 'success' ? 'success' : 'error'}
                        icon={log.status === 'success' ? <CheckCircleIcon /> : <CancelIcon />}
                      />
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
