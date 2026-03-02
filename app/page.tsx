'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Badge,
  Avatar,
  InputBase,
  Divider,
  Paper,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PeopleIcon from '@mui/icons-material/People'
import LayersIcon from '@mui/icons-material/Layers'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import BarChartIcon from '@mui/icons-material/BarChart'
import DnsIcon from '@mui/icons-material/Dns'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import VisibilityIcon from '@mui/icons-material/Visibility'
import MicIcon from '@mui/icons-material/Mic'
import DescriptionIcon from '@mui/icons-material/Description'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import SecurityIcon from '@mui/icons-material/Security'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'

// 模拟数据
const statsData = [
  {
    title: '今日调用量',
    value: '128,456',
    change: '+12.5%',
    trend: 'up',
    icon: LayersIcon,
    color: 'primary' as const
  },
  {
    title: '在线模型数',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: PsychologyIcon,
    color: 'secondary' as const
  },
  {
    title: '平均响应时间',
    value: '186ms',
    change: '-8.2%',
    trend: 'down',
    icon: FlashOnIcon,
    color: 'info' as const
  },
  {
    title: '系统可用率',
    value: '99.97%',
    change: '+0.02%',
    trend: 'up',
    icon: DnsIcon,
    color: 'success' as const
  },
]

const aiModels = [
  {
    name: '肺结节智能筛查',
    type: '影像诊断',
    status: 'online',
    calls: '45,230',
    accuracy: '98.5%',
    icon: VisibilityIcon
  },
  {
    name: '医疗报告生成',
    type: '大语言模型',
    status: 'online',
    calls: '32,180',
    accuracy: '96.8%',
    icon: DescriptionIcon
  },
  {
    name: '病理切片分析',
    type: '图像识别',
    status: 'online',
    calls: '28,650',
    accuracy: '97.2%',
    icon: ImageIcon
  },
  {
    name: '语音病历转写',
    type: '语音合成',
    status: 'maintenance',
    calls: '15,420',
    accuracy: '94.6%',
    icon: MicIcon
  },
]

const recentActivities = [
  { time: '2分钟前', event: '新接入模型：骨龄评估AI', type: 'success' },
  { time: '15分钟前', event: 'HIS系统完成API对接测试', type: 'success' },
  { time: '32分钟前', event: '语音病历转写模型进入维护', type: 'warning' },
  { time: '1小时前', event: '系统自动完成负载均衡调度', type: 'info' },
  { time: '2小时前', event: '影像云平台调用量达到峰值', type: 'info' },
]

const systemMetrics = [
  { name: 'CPU使用率', value: 45, icon: LayersIcon },
  { name: '内存使用', value: 62, icon: DnsIcon },
  { name: '网络带宽', value: 38, icon: AccountTreeIcon },
]

const sidebarItems = [
  { name: '控制台', icon: HomeIcon, active: true, path: '/' },
  { name: '影像管理', icon: ImageIcon, active: false, path: '/images' },
  { name: '诊断协作', icon: VisibilityIcon, active: false, path: '/collaboration' },
  { name: '权限管理', icon: SecurityIcon, active: false, path: '/permissions' },
  { name: 'AI模型管理', icon: PsychologyIcon, active: false, path: '/models' },
  { name: '流程编排', icon: AccountTreeIcon, active: false, path: '/workflows' },
  { name: '用户管理', icon: PeopleIcon, active: false, path: '/users' },
  { name: 'API网关', icon: LayersIcon, active: false, path: '/gateway' },
  { name: '系统监控', icon: FindInPageIcon, active: false, path: '/monitoring' },
  { name: '日志审计', icon: SearchIcon, active: false, path: '/audit' },
  { name: '系统设置', icon: SettingsIcon, active: false, path: '/settings' },
]

const quickActions = [
  { name: '接入新模型', icon: PsychologyIcon, color: 'primary', path: '/models' },
  { name: '创建流程', icon: AccountTreeIcon, color: 'secondary', path: '/workflows/editor' },
  { name: '调用报表', icon: BarChartIcon, color: 'success', path: '/monitoring' },
  { name: '安全审计', icon: SecurityIcon, color: 'warning', path: '/audit' },
]

const drawerWidth = 260

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('控制台')

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* 桌面端侧边栏 */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
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
              <PsychologyIcon sx={{ color: 'white', fontSize: 24 }} />
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

          <List sx={{ px: 1 }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => setActiveNav(item.name)}
                  selected={activeNav === item.name}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <List sx={{ px: 1 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="帮助中心" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2, color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="退出登录" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* 移动端侧边栏 */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
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
              <PsychologyIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                医学影像AI
              </Typography>
              <Typography variant="caption" color="text.secondary">
                集成平台 V2.0
              </Typography>
            </Box>
            <IconButton
              onClick={() => setSidebarOpen(false)}
              sx={{ ml: 'auto', display: { md: 'none' } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ px: 1 }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => setActiveNav(item.name)}
                  selected={activeNav === item.name}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <List sx={{ px: 1 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="帮助中心" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2, color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="退出登录" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* 主内容区 */}
      <Box sx={{ flexGrow: 1 }}>
        {/* 顶部导航 */}
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e2e8f0' }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Paper
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                px: 2,
                py: 0.5,
                bgcolor: '#f1f5f9',
                borderRadius: 2,
                flex: 1,
                maxWidth: 400,
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="搜索模型、接口、文档..."
                sx={{ flex: 1 }}
              />
            </Paper>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton>
                <Badge badgeContent={1} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton>
                <SettingsIcon />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                  }}
                >
                  管
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" fontWeight="medium">
                    系统管理员
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    admin@hospital.com
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* 页面内容 */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* 页面标题 */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                控制台
              </Typography>
              <Typography variant="body2" color="text.secondary">
                欢迎回来，查看平台运行状态和关键指标
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AccessTimeIcon />}
                size="small"
              >
                最近7天
              </Button>
              <Button
                variant="contained"
                startIcon={<FlashOnIcon />}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
                  },
                }}
              >
                快速接入
              </Button>
            </Box>
          </Box>

          {/* 统计卡片 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {statsData.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <Card
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {stat.trend === 'up' ? (
                            <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                          ) : (
                            <TrendingDownIcon sx={{ fontSize: 14, color: 'info.main' }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              color: stat.trend === 'up' ? 'success.main' : 'info.main',
                              fontWeight: 'medium',
                            }}
                          >
                            {stat.change}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: stat.color === 'primary' ? '#eff6ff' :
                            stat.color === 'secondary' ? '#f0fdf4' :
                              stat.color === 'success' ? '#f0fdf4' : '#fff7ed',
                        }}
                      >
                        <stat.icon
                          sx={{
                            fontSize: 28,
                            color: stat.color === 'primary' ? 'primary.main' :
                              stat.color === 'secondary' ? 'secondary.main' :
                                stat.color === 'success' ? 'success.main' : 'warning.main',
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* 主要内容区域 */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* AI模型状态 */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        AI模型运行状态
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        已接入的核心AI能力概览
                      </Typography>
                    </Box>
                    <Button endIcon={<ChevronRightIcon />} size="small">
                      查看全部
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {aiModels.map((model, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: '#f8fafc',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: '#f1f5f9',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: 'white',
                              boxShadow: 1,
                            }}
                          >
                            <model.icon sx={{ color: 'primary.main', fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {model.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {model.type}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight="medium">
                              {model.calls}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              今日调用
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" fontWeight="medium">
                              {model.accuracy}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              准确率
                            </Typography>
                          </Box>
                          <Chip
                            label={model.status === 'online' ? '运行中' : '维护中'}
                            size="small"
                            color={model.status === 'online' ? 'success' : 'warning'}
                          />
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 系统资源 */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    系统资源监控
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    实时资源使用情况
                  </Typography>

                  {systemMetrics.map((metric, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <metric.icon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight="medium">
                            {metric.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          {metric.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metric.value}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: metric.value > 70 ? 'warning.main' : 'primary.main',
                          },
                        }}
                      />
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      服务器状态
                    </Typography>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                      label="正常运行"
                      size="small"
                      color="success"
                      sx={{ '& .MuiChip-icon': { color: 'success.main' } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 底部区域 */}
          <Grid container spacing={3}>
            {/* 最近活动 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        最近活动
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        系统运行日志和事件
                      </Typography>
                    </Box>
                    <Button endIcon={<ChevronRightIcon />} size="small">
                      查看全部
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentActivities.map((activity, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box
                          sx={{
                            p: 0.75,
                            borderRadius: '50%',
                            bgcolor: activity.type === 'success' ? '#f0fdf4' :
                              activity.type === 'warning' ? '#fff7ed' : '#f8fafc',
                          }}
                        >
                          {activity.type === 'success' ? (
                            <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                          ) : activity.type === 'warning' ? (
                            <ErrorIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                          ) : (
                            <LayersIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">{activity.event}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 快速操作 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    快速操作
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    常用功能入口
                  </Typography>

                  <Grid container spacing={2}>
                    {quickActions.map((action, index) => (
                      <Grid size={{ xs: 6 }} key={index}>
                        <Paper
                          component={Link}
                          href={action.path}
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            borderRadius: 2,
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: '#f1f5f9',
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: action.color === 'primary' ? '#eff6ff' :
                                action.color === 'secondary' ? '#f0fdf4' :
                                  action.color === 'success' ? '#f0fdf4' : '#fff7ed',
                            }}
                          >
                            <action.icon
                              sx={{
                                fontSize: 24,
                                color: action.color === 'primary' ? 'primary.main' :
                                  action.color === 'secondary' ? 'secondary.main' :
                                    action.color === 'success' ? 'success.main' : 'warning.main',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            {action.name}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
