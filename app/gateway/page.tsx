'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function GatewayPage() {
  const [routes] = useState([
    { id: '1', path: '/api/v1/ai/*', target: 'http://ai-service:8080', method: 'ALL', status: 'active', qps: 120 },
    { id: '2', path: '/api/v1/workflow/*', target: 'http://workflow:8081', method: 'ALL', status: 'active', qps: 85 },
    { id: '3', path: '/api/v1/report/*', target: 'http://report:8082', method: 'GET,POST', status: 'inactive', qps: 0 }
  ])

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">API网关</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>统一管理API路由、限流和安全策略</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>新建路由</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">总路由数</Typography>
                  <Typography variant="h4" fontWeight="bold">{routes.length}</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#eff6ff' }}>
                  <AccountTreeIcon sx={{ color: 'primary.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">活跃路由</Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">{routes.filter(r => r.status === 'active').length}</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f0fdf4' }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">总QPS</Typography>
                  <Typography variant="h4" fontWeight="bold">205</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f5f3ff' }}>
                  <SpeedIcon sx={{ color: '#7c3aed' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">安全策略</Typography>
                  <Typography variant="h4" fontWeight="bold">3</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fff7ed' }}>
                  <SecurityIcon sx={{ color: 'warning.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>路由路径</TableCell>
                  <TableCell>目标服务</TableCell>
                  <TableCell>请求方法</TableCell>
                  <TableCell>QPS</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{route.path}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{route.target}</TableCell>
                    <TableCell><Chip label={route.method} size="small" /></TableCell>
                    <TableCell>{route.qps}</TableCell>
                    <TableCell>
                      <Chip label={route.status === 'active' ? '活跃' : '停用'} size="small" color={route.status === 'active' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
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
