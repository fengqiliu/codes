'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, IconButton, Menu, MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string
  department: string
  role: string
  status: 'active' | 'inactive' | 'locked'
  lastLogin: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: '张医生',
    username: 'zhangdoc',
    email: 'zhang.doc@hospital.com',
    phone: '138****1234',
    department: '影像科',
    role: 'MODEL_MANAGER',
    status: 'active',
    lastLogin: '2小时前',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: '李护士',
    username: 'linurse',
    email: 'li.nurse@hospital.com',
    phone: '139****5678',
    department: '放射科',
    role: 'API_USER',
    status: 'active',
    lastLogin: '1天前',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: '王主任',
    username: 'wangadmin',
    email: 'wang.admin@hospital.com',
    phone: '137****9012',
    department: '信息科',
    role: 'ADMIN',
    status: 'active',
    lastLogin: '5分钟前',
    createdAt: '2023-12-01'
  },
  {
    id: '4',
    name: '赵审计',
    username: 'zhaoaudit',
    email: 'zhao.audit@hospital.com',
    phone: '136****3456',
    department: '审计部',
    role: 'AUDITOR',
    status: 'inactive',
    lastLogin: '7天前',
    createdAt: '2024-03-10'
  }
]

const roleLabels: Record<string, { label: string, color: 'error' | 'primary' | 'secondary' | 'warning' | 'default' }> = {
  SUPER_ADMIN: { label: '超级管理员', color: 'error' },
  ADMIN: { label: '系统管理员', color: 'primary' },
  MODEL_MANAGER: { label: '模型管理员', color: 'secondary' },
  API_USER: { label: 'API用户', color: 'default' },
  AUDITOR: { label: '审计员', color: 'warning' },
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    department: '',
    role: 'API_USER'
  })

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">用户管理</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>管理系统用户和权限</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setShowAddModal(true)}
          sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
        >
          新建用户
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索用户姓名、用户名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>用户</TableCell>
                  <TableCell>部门</TableCell>
                  <TableCell>角色</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>最后登录</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{user.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Chip label={roleLabels[user.role]?.label || user.role} size="small" color={roleLabels[user.role]?.color || 'default'} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status === 'active' ? '活跃' : user.status === 'locked' ? '锁定' : '禁用'}
                        size="small"
                        color={user.status === 'active' ? 'success' : user.status === 'locked' ? 'warning' : 'default'}
                        icon={user.status === 'active' ? <CheckCircleIcon /> : user.status === 'locked' ? <LockIcon /> : <CancelIcon />}
                      />
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                      <IconButton size="small">
                        {user.status === 'locked' ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新建用户</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="姓名"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="用户名"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              label="邮箱"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="手机"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="部门"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField
              label="角色"
              fullWidth
              select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="SUPER_ADMIN">超级管理员</option>
              <option value="ADMIN">系统管理员</option>
              <option value="MODEL_MANAGER">模型管理员</option>
              <option value="API_USER">API用户</option>
              <option value="AUDITOR">审计员</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>取消</Button>
          <Button variant="contained" onClick={() => setShowAddModal(false)}>创建</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
