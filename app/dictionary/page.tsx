'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

export default function DictionaryPage() {
  const [dictionaries] = useState([
    { id: '1', type: 'user_status', label: '用户状态', items: 3, status: 'active' },
    { id: '2', type: 'model_type', label: '模型类型', items: 5, status: 'active' },
    { id: '3', type: 'device_type', label: '设备类型', items: 8, status: 'active' },
    { id: '4', type: 'exam_type', label: '检查类型', items: 12, status: 'inactive' }
  ])

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">字典管理</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>维护系统标准化数据字典</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>新建字典</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">字典类型</Typography>
                  <Typography variant="h4" fontWeight="bold">{dictionaries.length}</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#eff6ff' }}>
                  <MenuBookIcon sx={{ color: 'primary.main' }} />
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
                  <Typography variant="body2" color="text.secondary">字典项总数</Typography>
                  <Typography variant="h4" fontWeight="bold">28</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f0fdf4' }}>
                  <LocalOfferIcon sx={{ color: 'success.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth size="small" placeholder="搜索字典..." InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} /> }} />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>字典类型</TableCell>
                  <TableCell>字典名称</TableCell>
                  <TableCell>字典项数量</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dictionaries.map((dict) => (
                  <TableRow key={dict.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{dict.type}</TableCell>
                    <TableCell>{dict.label}</TableCell>
                    <TableCell>{dict.items}</TableCell>
                    <TableCell>
                      <Chip label={dict.status === 'active' ? '启用' : '停用'} size="small" color={dict.status === 'active' ? 'success' : 'default'} />
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
