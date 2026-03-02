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
  Avatar,
  AvatarGroup,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'
import MessageIcon from '@mui/icons-material/Message'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import DescriptionIcon from '@mui/icons-material/Description'
import ImageIcon from '@mui/icons-material/Image'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Link from 'next/link'

// 模拟协作案例数据
const collaborationCases = [
  {
    id: 1,
    title: '肺部结节多学科会诊',
    patientName: '张三',
    patientId: 'P001',
    modality: 'CT',
    department: '放射科',
    status: '进行中',
    participants: [
      { name: '李医生', role: '放射科', avatar: '李' },
      { name: '王医生', role: '胸外科', avatar: '王' },
      { name: '赵医生', role: '肿瘤科', avatar: '赵' },
    ],
    messages: 12,
    lastActivity: '10分钟前',
    priority: 'high',
  },
  {
    id: 2,
    title: '疑难病例讨论 - 头颅MRI',
    patientName: '李四',
    patientId: 'P002',
    modality: 'MRI',
    department: '神经内科',
    status: '待开始',
    participants: [
      { name: '张医生', role: '神经内科', avatar: '张' },
      { name: '刘医生', role: '影像科', avatar: '刘' },
    ],
    messages: 0,
    lastActivity: '2小时前',
    priority: 'normal',
  },
  {
    id: 3,
    title: '骨科术前规划讨论',
    patientName: '王五',
    patientId: 'P003',
    modality: 'CR',
    department: '骨科',
    status: '已完成',
    participants: [
      { name: '陈医生', role: '骨科', avatar: '陈' },
      { name: '周医生', role: '麻醉科', avatar: '周' },
      { name: '吴医生', role: '骨科', avatar: '吴' },
    ],
    messages: 28,
    lastActivity: '昨天',
    priority: 'normal',
  },
  {
    id: 4,
    title: '腹部肿瘤MDT',
    patientName: '赵六',
    patientId: 'P004',
    modality: 'CT',
    department: '消化内科',
    status: '进行中',
    participants: [
      { name: '孙医生', role: '消化内科', avatar: '孙' },
      { name: '郑医生', role: '普外科', avatar: '郑' },
    ],
    messages: 8,
    lastActivity: '30分钟前',
    priority: 'high',
  },
]

// 模拟团队成员
const teamMembers = [
  { id: 1, name: '李医生', role: '主任医师', department: '放射科', status: 'online' },
  { id: 2, name: '王医生', role: '副主任医师', department: '胸外科', status: 'online' },
  { id: 3, name: '张医生', role: '主治医师', department: '神经内科', status: 'away' },
  { id: 4, name: '赵医生', role: '住院医师', department: '肿瘤科', status: 'offline' },
]

// 模拟最近消息
const recentMessages = [
  {
    id: 1,
    sender: '李医生',
    content: '请查看患者CT图像的右肺上叶结节',
    time: '10分钟前',
    unread: true,
  },
  {
    id: 2,
    sender: '王医生',
    content: '建议进行增强CT检查进一步评估',
    time: '30分钟前',
    unread: true,
  },
  {
    id: 3,
    sender: '赵医生',
    content: '同意王医生的建议',
    time: '1小时前',
    unread: false,
  },
]

// 模拟报告模板
const reportTemplates = [
  { id: 1, name: '胸部CT报告模板', category: 'CT', usageCount: 156 },
  { id: 2, name: '头颅MRI报告模板', category: 'MRI', usageCount: 89 },
  { id: 3, name: '腹部CT报告模板', category: 'CT', usageCount: 124 },
  { id: 4, name: '骨科X光报告模板', category: 'X-ray', usageCount: 67 },
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

export default function CollaborationPage() {
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCaseTitle, setNewCaseTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'primary'
      case '待开始':
        return 'warning'
      case '已完成':
        return 'success'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === 'high' ? '#ef4444' : '#94a3b8'
  }

  const filteredCases = collaborationCases.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patientName.includes(searchQuery)
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
            <GroupIcon sx={{ color: 'white', fontSize: 24 }} />
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
            { name: '诊断协作', icon: '👥', path: '/collaboration', active: true },
            { name: '权限管理', icon: '🔒', path: '/permissions' },
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
              诊断协作
            </Typography>
            <Typography variant="body2" color="text.secondary">
              多学科会诊、病例讨论、团队协作
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
            创建会诊
          </Button>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* 左侧主区域 */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {/* 搜索栏 */}
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="搜索会诊案例..."
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
                </CardContent>
              </Card>

              {/* 标签页 */}
              <Card>
                <Tabs
                  value={tabValue}
                  onChange={(_, v) => setTabValue(v)}
                  sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                >
                  <Tab label="全部会诊" />
                  <Tab label="进行中" />
                  <Tab label="已完成" />
                  <Tab label="我的参与" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredCases.map((caseItem) => (
                      <Paper
                        key={caseItem.id}
                        sx={{
                          p: 2,
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 3,
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {caseItem.title}
                            </Typography>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: getPriorityColor(caseItem.priority),
                              }}
                            />
                          </Box>
                          <Chip
                            label={caseItem.status}
                            size="small"
                            color={getStatusColor(caseItem.status) as any}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            患者: {caseItem.patientName} ({caseItem.patientId})
                          </Typography>
                          <Chip label={caseItem.modality} size="small" variant="outlined" />
                          <Typography variant="body2" color="text.secondary">
                            {caseItem.department}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AvatarGroup max={4}>
                              {caseItem.participants.map((p, idx) => (
                                <Tooltip key={idx} title={`${p.name} - ${p.role}`}>
                                  <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                                    {p.avatar}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                            <Typography variant="caption" color="text.secondary">
                              {caseItem.participants.length}人参与
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <MessageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {caseItem.messages}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {caseItem.lastActivity}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography color="text.secondary">进行中的会诊</Typography>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <Typography color="text.secondary">已完成的会诊</Typography>
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  <Typography color="text.secondary">我参与的会诊</Typography>
                </TabPanel>
              </Card>
            </Grid>

            {/* 右侧边栏 */}
            <Grid size={{ xs: 12, lg: 4 }}>
              {/* 快速操作 */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    快速操作
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GroupIcon />}
                        component={Link}
                        href="/collaboration/viewer"
                        sx={{ py: 1.5 }}
                      >
                        创建会诊
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<VideoCallIcon />}
                        sx={{ py: 1.5 }}
                      >
                        视频会议
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DescriptionIcon />}
                        component={Link}
                        href="/collaboration/reports"
                        sx={{ py: 1.5 }}
                      >
                        报告管理
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ImageIcon />}
                        sx={{ py: 1.5 }}
                      >
                        查看影像
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* 在线团队成员 */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    在线成员
                  </Typography>
                  <List dense>
                    {teamMembers.map((member) => (
                      <ListItem key={member.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  bgcolor: member.status === 'online' ? '#22c55e' :
                                    member.status === 'away' ? '#f59e0b' : '#94a3b8',
                                  border: '2px solid white',
                                }}
                              />
                            }
                          >
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                              {member.name[0]}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={member.department}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* 最近消息 */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    最近消息
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {recentMessages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          p: 1.5,
                          bgcolor: msg.unread ? '#eff6ff' : '#f8fafc',
                          borderRadius: 1,
                          borderLeft: msg.unread ? '3px solid #2563eb' : 'none',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={msg.unread ? 'bold' : 'medium'}>
                            {msg.sender}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {msg.time}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {msg.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* 报告模板 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    常用模板
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {reportTemplates.map((template) => (
                      <Box
                        key={template.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          bgcolor: '#f8fafc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f1f5f9' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                          <Typography variant="body2">{template.name}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {template.usageCount}次
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* 创建会诊对话框 */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            创建新会诊
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="会诊标题"
                placeholder="请输入会诊标题"
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>选择模板</InputLabel>
                <Select
                  value={selectedTemplate}
                  label="选择模板"
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {reportTemplates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="患者姓名"
                placeholder="请输入患者姓名"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="患者ID"
                placeholder="请输入患者ID"
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>检查模态</InputLabel>
                <Select label="检查模态" defaultValue="">
                  <MenuItem value="CT">CT</MenuItem>
                  <MenuItem value="MRI">MRI</MenuItem>
                  <MenuItem value="US">超声</MenuItem>
                  <MenuItem value="X-ray">X光</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>会诊类型</InputLabel>
                <Select label="会诊类型" defaultValue="">
                  <MenuItem value="mdt">多学科会诊</MenuItem>
                  <MenuItem value="consultation">疑难病例讨论</MenuItem>
                  <MenuItem value="preoperative">术前讨论</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                邀请成员
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {teamMembers.map((member) => (
                  <Chip
                    key={member.id}
                    avatar={<Avatar>{member.name[0]}</Avatar>}
                    label={member.name}
                    variant="outlined"
                    onClick={() => {}}
                  />
                ))}
                <Chip
                  icon={<PersonAddIcon />}
                  label="添加成员"
                  variant="outlined"
                  onClick={() => {}}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            }}
          >
            创建会诊
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
