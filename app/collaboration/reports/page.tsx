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
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import PrintIcon from '@mui/icons-material/Print'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArticleIcon from '@mui/icons-material/Article'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Link from 'next/link'

// 模拟报告数据
const reports = [
  {
    id: 1,
    title: '胸部CT检查报告',
    patientName: '张三',
    patientId: 'P001',
    modality: 'CT',
    department: '放射科',
    author: '李医生',
    createTime: '2024-01-15 10:30',
    status: '已完成',
    aiAssist: true,
    content: '右肺上叶可见一枚大小约8mm的结节，边缘有毛刺...',
  },
  {
    id: 2,
    title: '头颅MRI检查报告',
    patientName: '李四',
    patientId: 'P002',
    modality: 'MRI',
    department: '神经内科',
    author: '张医生',
    createTime: '2024-01-14 14:20',
    status: '待审核',
    aiAssist: false,
    content: '颅内未见明显异常信号...',
  },
  {
    id: 3,
    title: '腹部CT检查报告',
    patientName: '王五',
    patientId: 'P003',
    modality: 'CT',
    department: '消化内科',
    author: '王医生',
    createTime: '2024-01-13 09:15',
    status: '已签署',
    aiAssist: true,
    content: '肝脏形态正常，实质回声均匀...',
  },
  {
    id: 4,
    title: '腰椎CR检查报告',
    patientName: '赵六',
    patientId: 'P004',
    modality: 'CR',
    department: '骨科',
    author: '陈医生',
    createTime: '2024-01-12 16:45',
    status: '已完成',
    aiAssist: false,
    content: '腰椎生理曲度存在，椎体...',
  },
  {
    id: 5,
    title: '心脏彩超报告',
    patientName: '钱七',
    patientId: 'P005',
    modality: 'US',
    department: '心内科',
    author: '赵医生',
    createTime: '2024-01-11 11:20',
    status: '草稿',
    aiAssist: true,
    content: '左室射血分数(LVEF)：60%...',
  },
]

// 模拟报告模板
const templates = [
  { id: 1, name: '胸部CT报告模板', category: 'CT', usageCount: 156 },
  { id: 2, name: '头颅MRI报告模板', category: 'MRI', usageCount: 89 },
  { id: 3, name: '腹部CT报告模板', category: 'CT', usageCount: 124 },
  { id: 4, name: '骨科X光报告模板', category: 'X-ray', usageCount: 67 },
  { id: 5, name: '心脏超声报告模板', category: 'US', usageCount: 45 },
  { id: 6, name: '乳腺钼靶报告模板', category: 'MG', usageCount: 38 },
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

export default function ReportsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedReport(report)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'success'
      case '待审核':
        return 'warning'
      case '已签署':
        return 'info'
      case '草稿':
        return 'default'
      default:
        return 'default'
    }
  }

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientName.includes(searchQuery)
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
            <DescriptionIcon sx={{ color: 'white', fontSize: 24 }} />
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
              报告管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              诊断报告撰写、模板管理、AI辅助生成
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setAiGenerateDialogOpen(true)}
            >
              AI生成报告
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              }}
            >
              新建报告
            </Button>
          </Box>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          {/* 搜索栏 */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="搜索报告标题、患者姓名..."
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
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>模态</InputLabel>
                    <Select label="模态" defaultValue="">
                      <MenuItem value="">全部</MenuItem>
                      <MenuItem value="CT">CT</MenuItem>
                      <MenuItem value="MRI">MRI</MenuItem>
                      <MenuItem value="US">超声</MenuItem>
                      <MenuItem value="X-ray">X光</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>状态</InputLabel>
                    <Select label="状态" defaultValue="">
                      <MenuItem value="">全部</MenuItem>
                      <MenuItem value="草稿">草稿</MenuItem>
                      <MenuItem value="待审核">待审核</MenuItem>
                      <MenuItem value="已完成">已完成</MenuItem>
                      <MenuItem value="已签署">已签署</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 标签页 */}
          <Card>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="全部报告" />
              <Tab label="我的报告" />
              <Tab label="待审核" />
              <Tab label="模板管理" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell>报告标题</TableCell>
                      <TableCell>患者信息</TableCell>
                      <TableCell>模态</TableCell>
                      <TableCell>报告人</TableCell>
                      <TableCell>创建时间</TableCell>
                      <TableCell>AI辅助</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <DescriptionIcon sx={{ color: '#94a3b8' }} />
                            <Typography variant="body2" fontWeight="medium">
                              {report.title}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{report.patientName}</Typography>
                          <Typography variant="caption" color="text.secondary">{report.patientId}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={report.modality} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{report.author[0]}</Avatar>
                            <Typography variant="body2">{report.author}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{report.createTime}</Typography>
                        </TableCell>
                        <TableCell>
                          {report.aiAssist && (
                            <Tooltip title="AI辅助生成">
                              <AutoAwesomeIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.status}
                            size="small"
                            color={getStatusColor(report.status) as any}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="编辑">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="下载">
                            <IconButton size="small">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="打印">
                            <IconButton size="small">
                              <PrintIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, report)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography color="text.secondary">我的报告</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography color="text.secondary">待审核报告</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                    <Card
                      sx={{
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor: '#eff6ff',
                            }}
                          >
                            <ArticleIcon sx={{ color: '#2563eb' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {template.name}
                            </Typography>
                            <Chip label={template.category} size="small" variant="outlined" />
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          已使用 {template.usageCount} 次
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                          <Button size="small" startIcon={<ContentCopyIcon />} fullWidth>
                            复制
                          </Button>
                          <Button size="small" startIcon={<EditIcon />} fullWidth>
                            编辑
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
          <ContentCopyIcon sx={{ mr: 1 }} fontSize="small" />
          复制
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          下载
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} fontSize="small" />
          分享
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          删除
        </MenuItem>
      </Menu>

      {/* 新建报告对话框 */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">新建诊断报告</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>选择模板</InputLabel>
                <Select
                  value={selectedTemplate}
                  label="选择模板"
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="患者姓名" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="患者ID" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={12}>
              <TextField
                fullWidth
                label="报告内容"
                multiline
                rows={8}
                placeholder="请输入诊断报告内容..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button variant="outlined">保存草稿</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
          >
            生成报告
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI生成报告对话框 */}
      <Dialog
        open={aiGenerateDialogOpen}
        onClose={() => setAiGenerateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: '#2563eb' }} />
            <Typography variant="h6" fontWeight="bold">AI智能生成报告</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="患者姓名" placeholder="请输入患者姓名" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="患者ID" placeholder="请输入患者ID" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>选择模板</InputLabel>
                <Select label="选择模板" defaultValue="">
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                选择影像文件
              </Typography>
              <Box
                sx={{
                  p: 3,
                  border: '2px dashed #cbd5e1',
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#2563eb' },
                }}
              >
                <Typography color="text.secondary">
                  点击选择影像文件或从影像管理中选择
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAiGenerateDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
          >
            开始生成
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
