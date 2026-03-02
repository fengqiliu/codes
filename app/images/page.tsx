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
  Avatar,
  Checkbox,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ImageIcon from '@mui/icons-material/Image'
import FolderIcon from '@mui/icons-material/Folder'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'

// 模拟影像数据
const mockImages = [
  {
    id: 1,
    name: '胸部CT扫描_2024-01-15_001',
    modality: 'CT',
    department: '放射科',
    patientName: '张三',
    patientId: 'P001',
    studyDate: '2024-01-15',
    size: '125.6 MB',
    format: 'DICOM',
    status: '正常',
    views: 234,
  },
  {
    id: 2,
    name: '头颅MRI_2024-01-14_002',
    modality: 'MRI',
    department: '神经内科',
    patientName: '李四',
    patientId: 'P002',
    studyDate: '2024-01-14',
    size: '256.3 MB',
    format: 'DICOM',
    status: '正常',
    views: 156,
  },
  {
    id: 3,
    name: '腹部超声_2024-01-13_003',
    modality: 'US',
    department: '消化内科',
    patientName: '王五',
    patientId: 'P003',
    studyDate: '2024-01-13',
    size: '8.2 MB',
    format: 'PNG',
    status: '已过期',
    views: 89,
  },
  {
    id: 4,
    name: '腰椎X光_2024-01-12_004',
    modality: 'CR',
    department: '骨科',
    patientName: '赵六',
    patientId: 'P004',
    studyDate: '2024-01-12',
    size: '4.5 MB',
    format: 'JPG',
    status: '正常',
    views: 67,
  },
  {
    id: 5,
    name: '心脏彩超_2024-01-11_005',
    modality: 'US',
    department: '心内科',
    patientName: '钱七',
    patientId: 'P005',
    studyDate: '2024-01-11',
    size: '15.8 MB',
    format: 'DICOM',
    status: '正常',
    views: 312,
  },
  {
    id: 6,
    name: '肺部DR_2024-01-10_006',
    modality: 'DR',
    department: '呼吸内科',
    patientName: '孙八',
    patientId: 'P006',
    studyDate: '2024-01-10',
    size: '6.2 MB',
    format: 'JPG',
    status: '正常',
    views: 45,
  },
]

const departments = ['全部科室', '放射科', '神经内科', '消化内科', '骨科', '心内科', '呼吸内科']
const modalities = ['全部模态', 'CT', 'MRI', 'US', 'CR', 'DR', 'X-ray']

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

export default function ImageManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('全部科室')
  const [selectedModality, setSelectedModality] = useState('全部模态')
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, image: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedImage(image)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedImages(mockImages.map(img => img.id))
    } else {
      setSelectedImages([])
    }
  }

  const handleSelectImage = (id: number) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files))
    }
  }

  const filteredImages = mockImages.filter(img => {
    const matchSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.patientName.includes(searchQuery)
    const matchDept = selectedDepartment === '全部科室' || img.department === selectedDepartment
    const matchModality = selectedModality === '全部模态' || img.modality === selectedModality
    return matchSearch && matchDept && matchModality
  })

  const getStatusColor = (status: string) => {
    return status === '正常' ? 'success' : 'error'
  }

  const getModalityColor = (modality: string) => {
    const colors: Record<string, string> = {
      CT: '#1976d2',
      MRI: '#9c27b0',
      US: '#388e3c',
      CR: '#f57c00',
      DR: '#d32f2f',
      'X-ray': '#00796b',
    }
    return colors[modality] || '#757575'
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
            <ImageIcon sx={{ color: 'white', fontSize: 24 }} />
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
            { name: '影像管理', icon: '🖼️', path: '/images', active: true },
            { name: '诊断协作', icon: '👥', path: '/collaboration' },
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
              component="a"
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
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: item.active ? 'primary.dark' : '#f1f5f9',
                },
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
              影像管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              管理医学影像文件，支持DICOM/PNG/JPG格式
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              上传影像
            </Button>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              }}
            >
              批量操作
            </Button>
          </Box>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          {/* 标签页 */}
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="全部影像" />
            <Tab label="我的上传" />
            <Tab label="分享给我" />
            <Tab label="已过期" />
          </Tabs>

          {/* 搜索和筛选 */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="搜索影像名称、患者姓名..."
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
                  <FormControl fullWidth size="small">
                    <InputLabel>科室</InputLabel>
                    <Select
                      value={selectedDepartment}
                      label="科室"
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>模态</InputLabel>
                    <Select
                      value={selectedModality}
                      label="模态"
                      onChange={(e) => setSelectedModality(e.target.value)}
                    >
                      {modalities.map((mod) => (
                        <MenuItem key={mod} value={mod}>{mod}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setViewMode('grid')}
                  >
                    <GridViewIcon />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setViewMode('table')}
                  >
                    <TableChartIcon />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 批量操作栏 */}
          {selectedImages.length > 0 && (
            <Card sx={{ mb: 3, bgcolor: '#eff6ff' }}>
              <CardContent sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Checkbox
                  checked={selectedImages.length === filteredImages.length}
                  indeterminate={selectedImages.length > 0 && selectedImages.length < filteredImages.length}
                  onChange={handleSelectAll}
                />
                <Typography variant="body2">
                  已选择 {selectedImages.length} 项
                </Typography>
                <Button size="small" startIcon={<DownloadIcon />}>批量下载</Button>
                <Button size="small" startIcon={<ShareIcon />}>批量分享</Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />}>批量删除</Button>
              </CardContent>
            </Card>
          )}

          {/* 表格视图 */}
          {viewMode === 'table' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedImages.length === filteredImages.length}
                        indeterminate={selectedImages.length > 0 && selectedImages.length < filteredImages.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>影像名称</TableCell>
                    <TableCell>患者信息</TableCell>
                    <TableCell>科室</TableCell>
                    <TableCell>模态</TableCell>
                    <TableCell>检查日期</TableCell>
                    <TableCell>大小</TableCell>
                    <TableCell>格式</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>查看次数</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredImages.map((image) => (
                    <TableRow
                      key={image.id}
                      hover
                      sx={{
                        bgcolor: selectedImages.includes(image.id) ? '#eff6ff' : 'transparent',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedImages.includes(image.id)}
                          onChange={() => handleSelectImage(image.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: getModalityColor(image.modality),
                              width: 36,
                              height: 36,
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {image.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{image.patientName}</Typography>
                        <Typography variant="caption" color="text.secondary">{image.patientId}</Typography>
                      </TableCell>
                      <TableCell>{image.department}</TableCell>
                      <TableCell>
                        <Chip
                          label={image.modality}
                          size="small"
                          sx={{
                            bgcolor: `${getModalityColor(image.modality)}20`,
                            color: getModalityColor(image.modality),
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell>{image.studyDate}</TableCell>
                      <TableCell>{image.size}</TableCell>
                      <TableCell>{image.format}</TableCell>
                      <TableCell>
                        <Chip
                          label={image.status}
                          size="small"
                          color={getStatusColor(image.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          {image.views}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="查看">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, image)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* 网格视图 */}
          {viewMode === 'grid' && (
            <Grid container spacing={2}>
              {filteredImages.map((image) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                  <Card
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 140,
                        bgcolor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                      <Chip
                        label={image.modality}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: getModalityColor(image.modality),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {image.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {image.patientName} | {image.department}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                        <Chip
                          label={image.status}
                          size="small"
                          color={getStatusColor(image.status) as any}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {image.size}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* 分页 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              共 {filteredImages.length} 条记录
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" disabled>
                上一页
              </Button>
              <Button variant="outlined" size="small">
                1
              </Button>
              <Button variant="outlined" size="small" disabled>
                下一页
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          查看
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          编辑
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          下载
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} fontSize="small" />
          分享
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          删除
        </MenuItem>
      </Menu>

      {/* 上传对话框 */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            上传影像文件
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed #cbd5e1',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              mt: 2,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: '#f8fafc',
              },
            }}
          >
            <input
              type="file"
              multiple
              accept=".dcm,.dicom,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <CloudUploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                点击或拖拽文件到此处上传
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                支持 DICOM, PNG, JPG 格式，单个文件最大 500MB
              </Typography>
            </label>
          </Box>

          {selectedFiles.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                已选择 {selectedFiles.length} 个文件
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      bgcolor: '#f8fafc',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ImageIcon fontSize="small" />
                    <Typography variant="body2" sx={{ flex: 1 }}>{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>科室</InputLabel>
                <Select label="科室" defaultValue="">
                  {departments.filter(d => d !== '全部科室').map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>模态</InputLabel>
                <Select label="模态" defaultValue="">
                  {modalities.filter(m => m !== '全部模态').map((mod) => (
                    <MenuItem key={mod} value={mod}>{mod}</MenuItem>
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
              <TextField fullWidth label="检查日期" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>有效期</InputLabel>
                <Select label="有效期" defaultValue="90">
                  <MenuItem value="30">30天</MenuItem>
                  <MenuItem value="90">90天</MenuItem>
                  <MenuItem value="180">180天</MenuItem>
                  <MenuItem value="365">1年</MenuItem>
                  <MenuItem value="0">永久</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            }}
            disabled={selectedFiles.length === 0}
          >
            开始上传
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
