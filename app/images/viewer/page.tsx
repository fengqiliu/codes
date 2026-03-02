'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Slider,
  Tooltip,
  Chip,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import FlipIcon from '@mui/icons-material/Flip'
import GridOnIcon from '@mui/icons-material/GridOn'
import GridOffIcon from '@mui/icons-material/GridOff'
import PanToolIcon from '@mui/icons-material/PanTool'
import StraightenIcon from '@mui/icons-material/Straighten'
import CommentIcon from '@mui/icons-material/Comment'
import BrushIcon from '@mui/icons-material/Brush'
import CircleIcon from '@mui/icons-material/Circle'
import SquareIcon from '@mui/icons-material/Square'
import LineWeightIcon from '@mui/icons-material/LineWeight'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import DownloadIcon from '@mui/icons-material/Download'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImageIcon from '@mui/icons-material/Image'
import PersonIcon from '@mui/icons-material/Person'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LayersIcon from '@mui/icons-material/Layers'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

// 模拟影像信息
const imageInfo = {
  id: 1,
  name: '胸部CT扫描_2024-01-15_001',
  modality: 'CT',
  department: '放射科',
  patientName: '张三',
  patientId: 'P001',
  patientAge: 45,
  patientGender: '男',
  studyDate: '2024-01-15',
  studyTime: '10:30:00',
  seriesDescription: '胸部常规CT',
  institutionName: '某某医院',
  size: '125.6 MB',
  dimensions: '512 × 512',
  slices: 156,
}

// 模拟标注数据
const annotations = [
  { id: 1, type: 'circle', x: 200, y: 150, radius: 30, label: '结节', color: '#ef4444' },
  { id: 2, type: 'rectangle', x: 100, y: 200, width: 60, height: 40, label: '区域1', color: '#22c55e' },
]

// 测量工具
const measurementTools = [
  { id: 'length', name: '长度', icon: StraightenIcon },
  { id: 'angle', name: '角度', icon: LineWeightIcon },
  { id: 'area', name: '面积', icon: SquareIcon },
  { id: 'ellipse', name: '椭圆', icon: CircleIcon },
]

// 标注工具
const annotationTools = [
  { id: 'pointer', name: '指针', icon: PanToolIcon },
  { id: 'brush', name: '画笔', icon: BrushIcon },
  { id: 'text', name: '文本', icon: TextFieldsIcon },
  { id: 'arrow', name: '箭头', icon: LineWeightIcon },
]

export default function ImageViewerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [activeTool, setActiveTool] = useState('pointer')
  const [brightness, setBrightness] = useState(50)
  const [contrast, setContrast] = useState(50)
  const [windowLevel, setWindowLevel] = useState({ width: 400, center: 40 })
  const [currentSlice, setCurrentSlice] = useState(78)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawings, setDrawings] = useState<any[]>(annotations)

  useEffect(() => {
    drawImage()
  }, [zoom, rotation, flipH, flipV, brightness, contrast, currentSlice])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 0.5
      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // 模拟影像绘制
    const scale = zoom / 100
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -scale : scale, flipV ? -scale : scale)

    // 绘制模拟肺部影像
    ctx.fillStyle = '#2d2d2d'
    ctx.beginPath()
    ctx.ellipse(0, 0, 180, 200, 0, 0, Math.PI * 2)
    ctx.fill()

    // 左肺
    ctx.fillStyle = '#3d3d3d'
    ctx.beginPath()
    ctx.ellipse(-70, -20, 60, 120, -0.2, 0, Math.PI * 2)
    ctx.fill()

    // 右肺
    ctx.beginPath()
    ctx.ellipse(70, -20, 65, 125, 0.2, 0, Math.PI * 2)
    ctx.fill()

    // 心脏轮廓
    ctx.fillStyle = '#4d4d4d'
    ctx.beginPath()
    ctx.ellipse(10, 60, 50, 70, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // 脊柱
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(-8, -180, 16, 360)

    ctx.restore()

    // 应用亮度和对比度
    ctx.fillStyle = `rgba(255,255,255,${(brightness - 50) / 100})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制标注
    drawings.forEach(drawing => {
      ctx.strokeStyle = drawing.color
      ctx.lineWidth = 3
      if (drawing.type === 'circle') {
        ctx.beginPath()
        ctx.arc(drawing.x, drawing.y, drawing.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = drawing.color
        ctx.font = '12px Arial'
        ctx.fillText(drawing.label, drawing.x + drawing.radius + 5, drawing.y)
      } else if (drawing.type === 'rectangle') {
        ctx.strokeRect(drawing.x, drawing.y, drawing.width, drawing.height)
        ctx.fillStyle = drawing.color
        ctx.font = '12px Arial'
        ctx.fillText(drawing.label, drawing.x, drawing.y - 5)
      }
    })

    // 绘制切片位置指示
    ctx.fillStyle = '#fff'
    ctx.font = '14px Arial'
    ctx.fillText(`切片: ${currentSlice} / ${imageInfo.slices}`, 20, canvas.height - 20)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 300))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 10))
  const handleRotateLeft = () => setRotation(prev => prev - 90)
  const handleRotateRight = () => setRotation(prev => prev + 90)
  const handleFlipH = () => setFlipH(prev => !prev)
  const handleFlipV = () => setFlipV(prev => !prev)

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1a1a1a' }}>
      {/* 左侧工具栏 */}
      <Box
        sx={{
          width: 60,
          bgcolor: '#252525',
          borderRight: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          gap: 1,
        }}
      >
        <Tooltip title="返回" placement="right">
          <IconButton sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Divider sx={{ width: '80%', bgcolor: '#333' }} />

        <Tooltip title="放大" placement="right">
          <IconButton sx={{ color: 'white' }} onClick={handleZoomIn}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="缩小" placement="right">
          <IconButton sx={{ color: 'white' }} onClick={handleZoomOut}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="左旋转" placement="right">
          <IconButton sx={{ color: 'white' }} onClick={handleRotateLeft}>
            <RotateLeftIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="右旋转" placement="right">
          <IconButton sx={{ color: 'white' }} onClick={handleRotateRight}>
            <RotateRightIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="水平翻转" placement="right">
          <IconButton sx={{ color: 'white' }} onClick={handleFlipH}>
            <FlipIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="网格" placement="right">
          <IconButton sx={{ color: showGrid ? '#2563eb' : 'white' }} onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
        </Tooltip>

        <Divider sx={{ width: '80%', bgcolor: '#333' }} />

        {annotationTools.map((tool) => (
          <Tooltip key={tool.id} title={tool.name} placement="right">
            <IconButton
              sx={{
                color: activeTool === tool.id ? '#2563eb' : 'white',
                bgcolor: activeTool === tool.id ? 'rgba(37,99,235,0.2)' : 'transparent',
              }}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon />
            </IconButton>
          </Tooltip>
        ))}

        <Divider sx={{ width: '80%', bgcolor: '#333' }} />

        <Tooltip title="撤销" placement="right">
          <IconButton sx={{ color: 'white' }}>
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="重做" placement="right">
          <IconButton sx={{ color: 'white' }}>
            <RedoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 中间画布区域 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 顶部信息栏 */}
        <Box
          sx={{
            height: 48,
            bgcolor: '#252525',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {imageInfo.name}
            </Typography>
            <Chip label={imageInfo.modality} size="small" sx={{ bgcolor: '#1976d2', color: 'white' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: 'white' }} size="small">
              <SaveIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }} size="small">
              <ShareIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }} size="small">
              <DownloadIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }} onClick={() => setIsFullscreen(!isFullscreen)}>
              <FullscreenIcon />
            </IconButton>
          </Box>
        </Box>

        {/* 画布 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              cursor: activeTool === 'pointer' ? 'default' : 'crosshair',
            }}
          />

          {/* 缩放显示 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              bgcolor: 'rgba(0,0,0,0.7)',
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'white' }}>
              缩放: {zoom}%
            </Typography>
          </Box>
        </Box>

        {/* 底部切片滑块 */}
        <Box
          sx={{
            height: 60,
            bgcolor: '#252525',
            borderTop: '1px solid #333',
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'white', minWidth: 60 }}>
            切片
          </Typography>
          <Slider
            value={currentSlice}
            min={1}
            max={imageInfo.slices}
            onChange={(_, value) => setCurrentSlice(value as number)}
            sx={{
              color: '#2563eb',
              '& .MuiSlider-thumb': {
                bgcolor: 'white',
              },
            }}
          />
          <Typography variant="body2" sx={{ color: 'white', minWidth: 80, textAlign: 'right' }}>
            {currentSlice} / {imageInfo.slices}
          </Typography>
        </Box>
      </Box>

      {/* 右侧信息面板 */}
      <Box
        sx={{
          width: 320,
          bgcolor: '#252525',
          borderLeft: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 影像信息 */}
        <Accordion defaultExpanded sx={{ bgcolor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="subtitle2">影像信息</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                </ListItemIcon>
                <ListItemText
                  primary={imageInfo.patientName}
                  secondary={`ID: ${imageInfo.patientId}`}
                  primaryTypographyProps={{ variant: 'body2', color: 'white' }}
                  secondaryTypographyProps={{ variant: 'caption', color: '#94a3b8' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CalendarTodayIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                </ListItemIcon>
                <ListItemText
                  primary={imageInfo.studyDate}
                  secondary={imageInfo.studyTime}
                  primaryTypographyProps={{ variant: 'body2', color: 'white' }}
                  secondaryTypographyProps={{ variant: 'caption', color: '#94a3b8' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LocalHospitalIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                </ListItemIcon>
                <ListItemText
                  primary={imageInfo.department}
                  secondary={imageInfo.institutionName}
                  primaryTypographyProps={{ variant: 'body2', color: 'white' }}
                  secondaryTypographyProps={{ variant: 'caption', color: '#94a3b8' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LayersIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${imageInfo.dimensions} × ${imageInfo.slices}层`}
                  secondary={imageInfo.size}
                  primaryTypographyProps={{ variant: 'body2', color: 'white' }}
                  secondaryTypographyProps={{ variant: 'caption', color: '#94a3b8' }}
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* 图像调整 */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="subtitle2">图像调整</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>亮度: {brightness}</Typography>
              <Slider
                value={brightness}
                onChange={(_, value) => setBrightness(value as number)}
                min={0}
                max={100}
                size="small"
                sx={{ color: '#2563eb' }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>对比度: {contrast}</Typography>
              <Slider
                value={contrast}
                onChange={(_, value) => setContrast(value as number)}
                min={0}
                max={100}
                size="small"
                sx={{ color: '#2563eb' }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>窗宽: {windowLevel.width}</Typography>
              <Slider
                value={windowLevel.width}
                onChange={(_, value) => setWindowLevel({ ...windowLevel, width: value as number })}
                min={50}
                max={1000}
                size="small"
                sx={{ color: '#2563eb' }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>窗位: {windowLevel.center}</Typography>
              <Slider
                value={windowLevel.center}
                onChange={(_, value) => setWindowLevel({ ...windowLevel, center: value as number })}
                min={-100}
                max={300}
                size="small"
                sx={{ color: '#2563eb' }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 标注列表 */}
        <Accordion defaultExpanded sx={{ bgcolor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="subtitle2">标注列表 ({drawings.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {drawings.map((drawing, index) => (
                <ListItem
                  key={drawing.id}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {drawing.type === 'circle' ? (
                      <CircleIcon sx={{ fontSize: 16, color: drawing.color }} />
                    ) : (
                      <SquareIcon sx={{ fontSize: 16, color: drawing.color }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={drawing.label}
                    secondary={`类型: ${drawing.type === 'circle' ? '圆形' : '矩形'}`}
                    primaryTypographyProps={{ variant: 'body2', color: 'white' }}
                    secondaryTypographyProps={{ variant: 'caption', color: '#94a3b8' }}
                  />
                  <IconButton size="small" sx={{ color: '#ef4444' }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* 测量工具 */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="subtitle2">测量工具</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {measurementTools.map((tool) => (
                <Grid size={6} key={tool.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<tool.icon />}
                    sx={{
                      color: 'white',
                      borderColor: '#444',
                      '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(37,99,235,0.1)' },
                    }}
                  >
                    {tool.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}

function DeleteIcon(props: any) {
  return <IconButton {...props}><DeleteIcon {...props} /></IconButton>
}
