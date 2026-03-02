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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PeopleIcon from '@mui/icons-material/People'
import Link from 'next/link'

const roles = [
  {
    id: 1,
    name: '系统管理员',
    code: 'admin',
    description: '拥有系统全部权限',
    userCount: 3,
    permissions: ['system', 'image', 'collaboration', 'ai'],
    status: 'active',
  },
  {
    id: 2,
    name: '放射科医生',
    code: 'radiologist',
    description: '放射科诊断医生',
    userCount: 12,
    permissions: ['image', 'collaboration', 'ai'],
    status: 'active',
  },
  {
    id: 3,
    name: '科室主任',
    code: 'department_head',
    description: '科室管理权限',
    userCount: 5,
    permissions: ['image', 'collaboration'],
    status: 'active',
  },
  {
    id: 4,
    name: '普通医生',
    code: 'doctor',
    description: '基础诊疗权限',
    userCount: 45,
    permissions: ['image.view', 'collaboration'],
    status: 'active',
  },
  {
    id: 5,
    name: '实习医生',
    code: 'intern',
    description: '实习权限',
    userCount: 20,
    permissions: ['image.view'],
    status: 'active',
  },
]

const allPermissions = [
  { id: 'system', name: '系统管理', children: ['system.user', 'system.role', 'system.audit', 'system.config'] },
  { id: 'image', name: '影像管理', children: ['image.view', 'image.upload', 'image.edit', 'image.delete', 'image.export'] },
  { id: 'collaboration', name: '诊断协作', children: ['collaboration.create', 'collaboration.join', 'collaboration.report.view', 'collaboration.report.write', 'collaboration.report.audit'] },
  { id: 'ai', name: 'AI模型', children: ['ai.invoke', 'ai.manage', 'ai.log'] },
]

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedRole(role)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditClick = () => {
    setSelectedPermissions(selectedRole?.permissions || [])
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 24 }} />
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
              角色管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              管理角色定义和权限分配
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
            新建角色
          </Button>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          {/* 搜索栏 */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="搜索角色..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 400 }}
              />
            </CardContent>
          </Card>

          {/* 角色列表 */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell>角色名称</TableCell>
                    <TableCell>角色编码</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>用户数</TableCell>
                    <TableCell>权限</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AdminPanelSettingsIcon sx={{ color: '#2563eb' }} />
                          <Typography variant="body2" fontWeight="medium">
                            {role.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={role.code} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          {role.userCount}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {role.permissions.slice(0, 3).map((p) => (
                            <Chip key={p} label={p} size="small" sx={{ fontSize: 10 }} />
                          ))}
                          {role.permissions.length > 3 && (
                            <Chip label={`+${role.permissions.length - 3}`} size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.status === 'active' ? '启用' : '禁用'}
                          size="small"
                          color={role.status === 'active' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => {
                          setSelectedRole(role)
                          setSelectedPermissions(role.permissions)
                          setEditDialogOpen(true)
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, role)}>
                          <MoreVertIcon fontSize="small" />
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

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          编辑
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PeopleIcon sx={{ mr: 1 }} fontSize="small" />
          分配用户
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          删除
        </MenuItem>
      </Menu>

      {/* 创建角色对话框 */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">新建角色</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="角色名称" placeholder="请输入角色名称" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="角色编码" placeholder="请输入角色编码" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="描述" multiline rows={2} placeholder="请输入角色描述" />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                分配权限
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                {allPermissions.map((perm) => (
                  <Box key={perm.id} sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={perm.name}
                    />
                    <Box sx={{ pl: 4 }}>
                      {perm.children?.map((child) => (
                        <FormControlLabel
                          key={child}
                          control={<Checkbox size="small" />}
                          label={child}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Paper>
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

      {/* 编辑角色对话框 */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">编辑角色 - {selectedRole?.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="角色名称" defaultValue={selectedRole?.name} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="角色编码" defaultValue={selectedRole?.code} disabled />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="描述" multiline rows={2} defaultValue={selectedRole?.description} />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                分配权限
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                {allPermissions.map((perm) => (
                  <Box key={perm.id} sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, perm.id, ...perm.children])
                            } else {
                              setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id && !perm.children.includes(p)))
                            }
                          }}
                        />
                      }
                      label={perm.name}
                    />
                    <Box sx={{ pl: 4 }}>
                      {perm.children?.map((child) => (
                        <FormControlLabel
                          key={child}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedPermissions.includes(child)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPermissions([...selectedPermissions, child])
                                } else {
                                  setSelectedPermissions(selectedPermissions.filter(p => p !== child))
                                }
                              }}
                            />
                          }
                          label={child}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Paper>
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
    </Box>
  )
}
