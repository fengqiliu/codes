'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import SecurityIcon from '@mui/icons-material/Security'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/Key'
import FilterListIcon from '@mui/icons-material/FilterList'
import Link from 'next/link'

const users = [
  { id: 1, name: '张三', username: 'zhangsan', email: 'zhangsan@hospital.com', role: '系统管理员', roleId: 1, department: '信息中心', status: 'active', lastLogin: '2024-01-15 10:30', phone: '13800138000' },
  { id: 2, name: '李医生', username: 'lixiao', email: 'lixiao@hospital.com', role: '放射科医生', roleId: 2, department: '放射科', status: 'active', lastLogin: '2024-01-15 09:20', phone: '13800138001' },
  { id: 3, name: '王主任', username: 'wangzhu', email: 'wangzhu@hospital.com', role: '科室主任', roleId: 3, department: '心内科', status: 'active', lastLogin: '2024-01-14 16:45', phone: '13800138002' },
  { id: 4, name: '赵医生', username: 'zhaoyi', email: 'zhaoyi@hospital.com', role: '普通医生', roleId: 4, department: '骨科', status: 'active', lastLogin: '2024-01-14 14:30', phone: '13800138003' },
  { id: 5, name: '孙医生', username: 'sunyi', email: 'sunyi@hospital.com', role: '普通医生', roleId: 4, department: '神经内科', status: 'active', lastLogin: '2024-01-14 11:00', phone: '13800138004' },
  { id: 6, name: '实习医生', username: 'shixi', email: 'shixi@hospital.com', role: '实习医生', roleId: 5, department: '神经内科', status: 'inactive', lastLogin: '2024-01-10 11:00', phone: '13800138005' },
  { id: 7, name: '周护士', username: 'zhouyi', email: 'zhouyi@hospital.com', role: '普通医生', roleId: 4, department: '心内科', status: 'active', lastLogin: '2024-01-13 09:00', phone: '13800138006' },
]

const roles = [
  { id: 1, name: '系统管理员' },
  { id: 2, name: '放射科医生' },
  { id: 3, name: '科室主任' },
  { id: 4, name: '普通医生' },
  { id: 5, name: '实习医生' },
]

const departments = ['信息中心', '放射科', '神经内科', '消化内科', '骨科', '心内科', '呼吸内科']

export default function UserPermissionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.includes(searchQuery)
    const matchRole = !roleFilter || u.role === roleFilter
    const matchDept = !deptFilter || u.department === deptFilter
    return matchSearch && matchRole && matchDept
  })

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  const handleAssignRole = (user: any) => {
    setSelectedUser(user)
    setRoleDialogOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* 侧边栏 */}
      <Box
        sx={{
          width: 260,
          bgcolor: 'white',
          borderRight: '1px solid #e2e8f0',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PeopleIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              医学影像AI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              集成平台 V2.0
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          {[
            { name: '控制台', icon: '📊', path: '/' },
            { name: '影像管理', icon: '🖼️', path: '/images' },
            { name: '诊断协作', icon: '👥', path: '/collaboration' },
            { name: '权限管理', icon: '🔒', path: '/permissions', active: true },
            { name: 'AI模型管理', icon: '🤖', path: '/models' },
            { name: '流程编排', icon: '🔀', path: '/workflows' },
          ].map((item) => (
            <Box
              key={item.name}
              component={Link}
              href={item.path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                textDecoration: 'none',
                color: item.active ? 'white' : 'text.primary',
                bgcolor: item.active ? 'primary.main' : 'transparent',
                mb: 0.5,
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <Typography variant="body2" fontWeight={item.active ? '600' : '400'}>
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 主内容区 */}
      <Box sx={{ flex: 1 }}>
        {/* 顶部导航 */}
        <Box
          sx={{
            bgcolor: 'white',
            borderBottom: '1px solid #e2e8f0',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              用户权限
            </Typography>
            <Typography variant="body2" color="text.secondary">
              管理用户信息和角色分配
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            }}
          >
            添加用户
          </Button>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          {/* 搜索和筛选 */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="搜索用户姓名、用户名、邮箱..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>角色</InputLabel>
                    <Select
                      value={roleFilter}
                      label="角色"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <MenuItem value="">全部</MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>科室</InputLabel>
                    <Select
                      value={deptFilter}
                      label="科室"
                      onChange={(e) => setDeptFilter(e.target.value)}
                    >
                      <MenuItem value="">全部</MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 用户列表 */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell>用户</TableCell>
                    <TableCell>用户名</TableCell>
                    <TableCell>邮箱</TableCell>
                    <TableCell>手机</TableCell>
                    <TableCell>角色</TableCell>
                    <TableCell>科室</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>最后登录</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb' }}>
                            {user.name[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === 'active' ? '在线' : '离线'}
                          size="small"
                          color={user.status === 'active' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.lastLogin}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditUser(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleAssignRole(user)}>
                          <KeyIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>

      {/* 创建用户对话框 */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">添加用户</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="姓名" placeholder="请输入姓名" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="用户名" placeholder="请输入用户名" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="邮箱" placeholder="请输入邮箱" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="手机" placeholder="请输入手机号" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>角色</InputLabel>
                <Select label="角色" defaultValue="">
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>科室</InputLabel>
                <Select label="科室" defaultValue="">
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="初始密码" type="password" placeholder="请输入初始密码" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
          >
            创建
          </Button>
        </DialogActions>
      </Dialog>

      {/* 编辑用户对话框 */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">编辑用户 - {selectedUser?.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="姓名" defaultValue={selectedUser?.name} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="用户名" defaultValue={selectedUser?.username} disabled />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="邮箱" defaultValue={selectedUser?.email} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="手机" defaultValue={selectedUser?.phone} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>科室</InputLabel>
                <Select label="科室" defaultValue={selectedUser?.department}>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select label="状态" defaultValue={selectedUser?.status}>
                  <MenuItem value="active">启用</MenuItem>
                  <MenuItem value="inactive">禁用</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 分配角色对话框 */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyIcon sx={{ color: '#2563eb' }} />
            <Typography variant="h6" fontWeight="bold">
              分配角色 - {selectedUser?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            当前角色: {selectedUser?.role}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>选择角色</InputLabel>
            <Select
              label="选择角色"
              defaultValue={selectedUser?.roleId}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            数据权限
          </Typography>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="查看所有数据"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="仅查看本部门数据"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="仅查看本人数据"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRoleDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
          >
            确认分配
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
