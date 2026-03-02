'use client'

import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ScheduleIcon from '@mui/icons-material/Schedule'
import Link from 'next/link'

interface FileUpload {
  id: number
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
}

// 模拟已上传的文件记录
const uploadedFiles = [
  { id: 1, name: '胸部CT扫描.dcm', size: '125.6 MB', date: '2024-01-15 10:30', status: 'completed' },
  { id: 2, name: '头颅MRI.dcm', size: '256.3 MB', date: '2024-01-14 14:20', status: 'completed' },
  { id: 3, name: '腹部超声.png', size: '8.2 MB', date: '2024-01-13 09:15', status: 'completed' },
]

export default function ImageUploadPage() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileUpload[] = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const,
      progress: 0,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleRemoveFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleUpload = () => {
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })))

    // 模拟上传过程
    files.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f =>
          f.id === file.id
            ? { ...f, progress: 100, status: 'completed' as const }
            : f
        ))
      }, (index + 1) * 2000)
    })
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(2) + ' MB'
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="已完成" size="small" color="success" />
      case 'uploading':
        return <Chip icon={<ScheduleIcon />} label="上传中" size="small" color="primary" />
      case 'error':
        return <Chip icon={<ErrorIcon />} label="失败" size="small" color="error" />
      default:
        return <Chip label="等待中" size="small" />
    }
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
            gap: 2,
          }}
        >
          <IconButton component={Link} href="/images">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              上传影像
            </Typography>
            <Typography variant="body2" color="text.secondary">
              上传DICOM、PNG、JPG格式的医学影像文件
            </Typography>
          </Box>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* 上传区域 */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    选择文件
                  </Typography>

                  <Box
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    sx={{
                      border: `2px dashed ${dragActive ? '#2563eb' : '#cbd5e1'}`,
                      borderRadius: 2,
                      p: 6,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: dragActive ? '#eff6ff' : '#f8fafc',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#2563eb',
                        bgcolor: '#eff6ff',
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".dcm,.dicom,.png,.jpg,.jpeg"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <CloudUploadIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      点击或拖拽文件到此处上传
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      支持 DICOM (.dcm), PNG, JPG 格式
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      单个文件最大 500MB
                    </Typography>
                  </Box>

                  {/* 文件列表 */}
                  {files.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          待上传文件 ({files.length})
                        </Typography>
                        <Button size="small" color="error" onClick={() => setFiles([])}>
                          清空全部
                        </Button>
                      </Box>

                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                              <TableCell>文件名</TableCell>
                              <TableCell>大小</TableCell>
                              <TableCell>类型</TableCell>
                              <TableCell>状态</TableCell>
                              <TableCell align="right">操作</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {files.map((file) => (
                              <TableRow key={file.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ImageIcon fontSize="small" />
                                    <Typography variant="body2">{file.name}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>{formatSize(file.size)}</TableCell>
                                <TableCell>{file.type || '未知'}</TableCell>
                                <TableCell>
                                  {file.status === 'uploading' ? (
                                    <Box sx={{ width: 100 }}>
                                      <LinearProgress variant="determinate" value={file.progress} />
                                    </Box>
                                  ) : (
                                    getStatusChip(file.status)
                                  )}
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveFile(file.id)}
                                    disabled={file.status === 'uploading'}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleUpload}
                          disabled={files.length === 0}
                          sx={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                          }}
                        >
                          开始上传
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 右侧配置区域 */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    文件信息
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <FormControl fullWidth>
                        <InputLabel>科室</InputLabel>
                        <Select label="科室" defaultValue="">
                          <MenuItem value="放射科">放射科</MenuItem>
                          <MenuItem value="神经内科">神经内科</MenuItem>
                          <MenuItem value="消化内科">消化内科</MenuItem>
                          <MenuItem value="骨科">骨科</MenuItem>
                          <MenuItem value="心内科">心内科</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={12}>
                      <FormControl fullWidth>
                        <InputLabel>模态</InputLabel>
                        <Select label="模态" defaultValue="">
                          <MenuItem value="CT">CT</MenuItem>
                          <MenuItem value="MRI">MRI</MenuItem>
                          <MenuItem value="US">超声</MenuItem>
                          <MenuItem value="DR">DR</MenuItem>
                          <MenuItem value="CR">CR</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={12}>
                      <TextField fullWidth label="患者姓名" />
                    </Grid>
                    <Grid size={12}>
                      <TextField fullWidth label="患者ID" />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="检查日期"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField fullWidth label="检查号" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    存储设置
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12}>
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
                    <Grid size={12}>
                      <FormControl fullWidth>
                        <InputLabel>存储位置</InputLabel>
                        <Select label="存储位置" defaultValue="local">
                          <MenuItem value="local">本地存储</MenuItem>
                          <MenuItem value="cloud">云存储</MenuItem>
                          <MenuItem value="pacs">PACS服务器</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={12}>
                      <FormControl fullWidth>
                        <InputLabel>隐私级别</InputLabel>
                        <Select label="隐私级别" defaultValue="normal">
                          <MenuItem value="normal">普通</MenuItem>
                          <MenuItem value="sensitive">敏感</MenuItem>
                          <MenuItem value="confidential">机密</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    最近上传
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {uploadedFiles.map((file) => (
                      <Box
                        key={file.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          bgcolor: '#f8fafc',
                          borderRadius: 1,
                        }}
                      >
                        <ImageIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" noWrap>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {file.size} · {file.date}
                          </Typography>
                        </Box>
                        <Chip label="完成" size="small" color="success" />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
