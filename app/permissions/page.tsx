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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Checkbox,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import SecurityIcon from '@mui/icons-material/Security'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentIcon from '@mui/icons-material/Assignment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'

// 模拟权限数据
const permissions = [
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    children: [
      { id: 11, name: '用户管理', code: 'system.user', description: '管理系统用户' },
      { id: 12, name: '角色管理', code: 'system.role', description: '管理角色和权限' },
      { id: 13, name: '日志审计', code: 'system.audit', description: '查看系统日志' },
      { id: 14, name: '系统设置', code: 'system.config', description: '系统配置' },
    ],
  },
  {
    id: 2,
    name: '影像管理',
    code: 'image',
    children: [
      { id: 21, name: '查看影像', code: 'image.view', description: '查看医学影像' },
      { id: 22, name: '上传影像', code: 'image.upload', description: '上传医学影像' },
      { id: 23, name: '编辑影像', code: 'image.edit', description: '编辑影像信息' },
      { id: 24, name: '删除影像', code: 'image.delete', description: '删除影像文件' },
      { id: 25, name: '导出影像', code: 'image.export', description: '导出影像文件' },
    ],
  },
  {
    id: 3,
    name: '诊断协作',
    code: 'collaboration',
    children: [
      { id: 31, name: '创建会诊', code: 'collaboration.create', description: '创建会诊病例' },
      { id: 32, name: '参与会诊', code: 'collaboration.join', description: '参与会诊讨论' },
      { id: 33, name: '查看报告', code: 'collaboration.report.view', description: '查看诊断报告' },
      { id: 34, name: '编写报告', code: 'collaboration.report.write', description: '编写诊断报告' },
      { id: 35, name: '审核报告', code: 'collaboration.report.audit', description: '审核诊断报告' },
    ],
  },
  {
    id: 4,
    name: 'AI模型',
    code: 'ai',
    children: [
      { id: 41, name: '模型调用', code: 'ai.invoke', description: '调用AI模型' },
      { id: 42, name: '模型管理', code: 'ai.manage', description: '管理AI模型' },
      { id: 43, name: '查看日志', code: 'ai.log', description: '查看调用日志' },
    ],
  },
]

// 模拟角色数据
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

// 模拟用户数据
const users = [
  { id: 1, name: '张三', username: 'zhangsan', email: 'zhangsan@hospital.com', role: '系统管理员', department: '信息中心', status: 'active', lastLogin: '2024-01-15 10:30' },
  { id: 2, name: '李医生', username: 'lixiao', email: 'lixiao@hospital.com', role: '放射科医生', department: '放射科', status: 'active', lastLogin: '2024-01-15 09:20' },
  { id: 3, name: '王主任', username: 'wangzhu', email: 'wangzhu@hospital.com', role: '科室主任', department: '心内科', status: 'active', lastLogin: '2024-01-14 16:45' },
  { id: 4, name: '赵医生', username: 'zhaoyi', email: 'zhaoyi@hospital.com', role: '普通医生', department: '骨科', status: 'active', lastLogin: '2024-01-14 14:30' },
  { id: 5, name: '实习医生', username: 'shixi', email: 'shixi@hospital.com', role: '实习医生', department: '神经内科', status: 'inactive', lastLogin: '2024-01-10 11:00' },
]

// 模拟审计日志
const auditLogs = [
  { id: 1, user: '张三', action: '用户登录', resource: '系统', ip: '192.168.1.100', time: '2024-01-15 10:30:00', status: 'success' },
  { id: 2, user: '李医生', action: '上传影像', resource: '胸部CT_001', ip: '192.168.1.101', time: '2024-01-15 09:45:00', status: 'success' },
  { id: 3, user: '王主任', action: '修改报告', resource: '诊断报告_001', ip: '192.168.1.102', time: '2024-01-15 09:30:00', status: 'success' },
  { id: 4, user: '赵医生', action: '删除影像', resource: '腹部CT_003', ip: '192.168.1.103', time: '2024-01-14 16:20:00', status: 'warning' },
  { id: 5, user: '管理员', action: '修改权限', resource: '角色_放射科医生', ip: '192.168.1.100', time: '2024-01-14 14:00:00', status: 'success' },
]

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function PermissionsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const filteredPermissions = permissions.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.children?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <SecurityIcon sx={{ color: 'white', fontSize: 24 }} />
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
            { name: '用户管理', icon: '👤', path: '/users' },
            { name: 'API网关', icon: '🌐', path: '/gateway' },
            { name: '系统监控', icon: '📈', path: '/monitoring' },
            { name: '日志审计', icon: '📝', path: '/audit' },
            { name: '系统设置', icon: '⚙️', path: '/settings' },
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
              权限管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              角色权限配置、用户管理、操作审计
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
          {/* 标签页 */}
          <Card>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab icon={<AdminPanelSettingsIcon />} iconPosition="start" label="权限配置" />
              <Tab icon={<PeopleIcon />} iconPosition="start" label="角色管理" />
              <Tab icon={<PeopleIcon />} iconPosition="start" label="用户权限" />
              <Tab icon={<AssignmentIcon />} iconPosition="start" label="审计日志" />
            </Tabs>

            {/* 权限配置 */}
            <TabPanel value={tabValue} index={0}>
              <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
                <CardContent>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="搜索权限..."
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

              {filteredPermissions.map((perm) => (
                <Accordion key={perm.id} defaultExpanded sx={{ bgcolor: 'white', mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {perm.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({perm.code})
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {perm.children?.map((child) => (
                      <Box key={child.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, pl: 2 }}>
                        <Checkbox size="small" sx={{ p: 0 }} />
                        <Box>
                          <Typography variant="body2">{child.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {child.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabPanel>

            {/* 角色管理 */}
            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell>角色名称</TableCell>
                      <TableCell>角色编码</TableCell>
                      <TableCell>描述</TableCell>
                      <TableCell>用户数</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
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
                        <TableCell>{role.userCount}</TableCell>
                        <TableCell>
                          <Chip
                            label={role.status === 'active' ? '启用' : '禁用'}
                            size="small"
                            color={role.status === 'active' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="编辑">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, role)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* 用户权限 */}
            <TabPanel value={tabValue} index={2}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell>用户</TableCell>
                      <TableCell>用户名</TableCell>
                      <TableCell>邮箱</TableCell>
                      <TableCell>角色</TableCell>
                      <TableCell>科室</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>最后登录</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 14,
                              }}
                            >
                              {user.name[0]}
                            </Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.role} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status === 'active' ? '在线' : '离线'}
                            size="small"
                            color={user.status === 'active' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="编辑权限">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="分配角色">
                            <IconButton size="small">
                              <PeopleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* 审计日志 */}
            <TabPanel value={tabValue} index={3}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell>时间</TableCell>
                      <TableCell>操作用户</TableCell>
                      <TableCell>操作类型</TableCell>
                      <TableCell>操作资源</TableCell>
                      <TableCell>IP地址</TableCell>
                      <TableCell>状态</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>{log.time}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {log.user}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Chip label={log.resource} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.ip}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {log.status === 'success' ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="成功"
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip
                              icon={<CancelIcon />}
                              label="警告"
                              size="small"
                              color="warning"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </Card>
        </Box>
      </Box>

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
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
                {permissions.map((perm) => (
                  <Box key={perm.id} sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={perm.name}
                    />
                    <Box sx={{ pl: 4 }}>
                      {perm.children?.map((child) => (
                        <FormControlLabel
                          key={child.id}
                          control={<Checkbox size="small" />}
                          label={child.name}
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
    </Box>
  )
}
