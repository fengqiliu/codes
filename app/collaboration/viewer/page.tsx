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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  AvatarGroup,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import GridOnIcon from '@mui/icons-material/GridOn'
import GridOffIcon from '@mui/icons-material/GridOff'
import PanToolIcon from '@mui/icons-material/PanTool'
import StraightenIcon from '@mui/icons-material/Straighten'
import CircleIcon from '@mui/icons-material/Circle'
import SquareIcon from '@mui/icons-material/Square'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import DownloadIcon from '@mui/icons-material/Download'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImageIcon from '@mui/icons-material/Image'
import CommentIcon from '@mui/icons-material/Comment'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MicIcon from '@mui/icons-material/Mic'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Link from 'next/link'

// 模拟会诊信息
const consultationInfo = {
  id: 1,
  title: '肺部结节多学科会诊',
  patientName: '张三',
  patientId: 'P001',
  modality: 'CT',
  department: '放射科',
  studyDate: '2024-01-15',
  participants: [
    { name: '李医生', role: '放射科', avatar: '李', status: 'online' },
    { name: '王医生', role: '胸外科', avatar: '王', status: 'online' },
    { name: '赵医生', role: '肿瘤科', avatar: '赵', status: 'away' },
  ],
}

// 模拟聊天消息
const chatMessages = [
  {
    id: 1,
    sender: '李医生',
    avatar: '李',
    content: '请查看患者CT图像的右肺上叶结节，大小约8mm',
    time: '10:30',
    isCurrentUser: false,
  },
  {
    id: 2,
    sender: '王医生',
    avatar: '王',
    content: '看到了，边缘有毛刺，建议进一步增强CT检查',
    time: '10:32',
    isCurrentUser: false,
  },
  {
    id: 3,
    sender: '我',
    avatar: '我',
    content: '同意，建议3个月后复查对比',
    time: '10:35',
    isCurrentUser: true,
  },
  {
    id: 4,
    sender: '赵医生',
    avatar: '赵',
    content: '建议做PET-CT评估代谢活性',
    time: '10:40',
    isCurrentUser: false,
  },
]

// 模拟标注数据
const annotations = [
  { id: 1, type: 'circle', x: 280, y: 180, radius: 25, label: '结节1', color: '#ef4444', author: '李医生' },
  { id: 2, type: 'circle', x: 350, y: 220, radius: 15, label: '结节2', color: '#f59e0b', author: '王医生' },
  { id: 3, type: 'rectangle', x: 200, y: 300, width: 80, height: 60, label: '炎症区域', color: '#22c55e', author: '李医生' },
]

export default function CollaborationViewerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [activeTool, setActiveTool] = useState('pointer')
  const [brightness, setBrightness] = useState(50)
  const [contrast, setContrast] = useState(50)
  const [currentSlice, setCurrentSlice] = useState(78)
  const [totalSlices] = useState(156)
  const [drawings, setDrawings] = useState(annotations)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState(chatMessages)
  const [chatDrawerOpen, setChatDrawerOpen] = useState(true)

  useEffect(() => {
    drawImage()
  }, [zoom, rotation, showGrid, brightness, contrast, currentSlice, drawings])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (showGrid) {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 0.5
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const scale = zoom / 100
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)

    ctx.fillStyle = '#2d2d2d'
    ctx.beginPath()
    ctx.ellipse(0, 0, 180, 200, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#3d3d3d'
    ctx.beginPath()
    ctx.ellipse(-70, -20, 60, 120, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(70, -20, 65, 125, 0.2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#4d4d4d'
    ctx.beginPath()
    ctx.ellipse(10, 60, 50, 70, 0.1, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(-8, -180, 16, 360)

    ctx.restore()

    drawings.forEach(drawing => {
      ctx.strokeStyle = drawing.color
      ctx.lineWidth = 3
      ctx.beginPath()
      if (drawing.type === 'circle') {
        const radius = drawing.radius || 0
        ctx.arc(drawing.x, drawing.y, radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = drawing.color
        ctx.font = 'bold 12px Arial'
        ctx.fillText(drawing.label, drawing.x + radius + 5, drawing.y)
        ctx.font = '10px Arial'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`@${drawing.author}`, drawing.x + radius + 5, drawing.y + 12)
      } else if (drawing.type === 'rectangle') {
        ctx.strokeRect(drawing.x, drawing.y, drawing.width || 0, drawing.height || 0)
        ctx.fillStyle = drawing.color
        ctx.font = 'bold 12px Arial'
        ctx.fillText(drawing.label, drawing.x, drawing.y - 5)
      }
    })

    ctx.fillStyle = '#fff'
    ctx.font = '14px Arial'
    ctx.fillText(`切片: ${currentSlice} / ${totalSlices}`, 20, canvas.height - 20)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 300))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 10))
  const handleRotateLeft = () => setRotation(prev => prev - 90)
  const handleRotateRight = () => setRotation(prev => prev + 90)

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: '我',
          avatar: '我',
          content: chatInput,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: true,
        },
      ])
      setChatInput('')
    }
  }

  const tools = [
    { id: 'pointer', name: '指针', icon: PanToolIcon },
    { id: 'circle', name: '圆形标注', icon: CircleIcon },
    { id: 'rectangle', name: '矩形标注', icon: SquareIcon },
    { id: 'ruler', name: '测量', icon: StraightenIcon },
  ]

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
          <IconButton sx={{ color: 'white' }} component={Link} href="/collaboration">
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
        <Tooltip title="网格" placement="right">
          <IconButton sx={{ color: showGrid ? '#2563eb' : 'white' }} onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
        </Tooltip>

        <Divider sx={{ width: '80%', bgcolor: '#333' }} />

        {tools.map((tool) => (
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
            height: 56,
            bgcolor: '#252525',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
              {consultationInfo.title}
            </Typography>
            <Chip label={consultationInfo.modality} size="small" sx={{ bgcolor: '#1976d2', color: 'white' }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              患者: {consultationInfo.patientName} ({consultationInfo.patientId})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup max={4}>
              {consultationInfo.participants.map((p, idx) => (
                <Tooltip key={idx} title={`${p.name} - ${p.role}`}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#2563eb' }}>
                    {p.avatar}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: '#333' }} />
            <Tooltip title="邀请成员">
              <IconButton sx={{ color: 'white' }} size="small">
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="视频会议">
              <IconButton sx={{ color: 'white' }} size="small">
                <VideoCallIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="语音">
              <IconButton sx={{ color: 'white' }} size="small">
                <MicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="保存">
              <IconButton sx={{ color: 'white' }} size="small">
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="分享">
              <IconButton sx={{ color: 'white' }} size="small">
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="下载">
              <IconButton sx={{ color: 'white' }} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
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
            height={500}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              cursor: activeTool === 'pointer' ? 'default' : 'crosshair',
            }}
          />

          <Box sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'rgba(0,0,0,0.7)', px: 2, py: 1, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>缩放: {zoom}%</Typography>
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
          <Typography variant="body2" sx={{ color: 'white', minWidth: 60 }}>切片</Typography>
          <Slider
            value={currentSlice}
            onChange={(_, value) => setCurrentSlice(value as number)}
            min={1}
            max={totalSlices}
            sx={{ color: '#2563eb' }}
          />
          <Typography variant="body2" sx={{ color: 'white', minWidth: 80, textAlign: 'right' }}>
            {currentSlice} / {totalSlices}
          </Typography>
        </Box>
      </Box>

      {/* 右侧面板 */}
      <Box
        sx={{
          width: 360,
          bgcolor: '#252525',
          borderLeft: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 标签切换 */}
        <Box sx={{ display: 'flex', borderBottom: '1px solid #333' }}>
          <Button
            fullWidth
            sx={{
              color: chatDrawerOpen ? '#2563eb' : '#94a3b8',
              borderBottom: chatDrawerOpen ? '2px solid #2563eb' : 'none',
              borderRadius: 0,
            }}
            onClick={() => setChatDrawerOpen(true)}
          >
            <CommentIcon sx={{ mr: 1 }} />
            讨论 ({messages.length})
          </Button>
          <Button
            fullWidth
            sx={{
              color: !chatDrawerOpen ? '#2563eb' : '#94a3b8',
              borderBottom: !chatDrawerOpen ? '2px solid #2563eb' : 'none',
              borderRadius: 0,
            }}
            onClick={() => setChatDrawerOpen(false)}
          >
            <ImageIcon sx={{ mr: 1 }} />
            标注 ({drawings.length})
          </Button>
        </Box>

        {chatDrawerOpen ? (
          <>
            {/* 聊天消息 */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: msg.isCurrentUser ? 'row-reverse' : 'row',
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: msg.isCurrentUser ? '#0d9488' : '#2563eb' }}>
                    {msg.avatar}
                  </Avatar>
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1.5,
                      bgcolor: msg.isCurrentUser ? '#0d9488' : '#333',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: msg.isCurrentUser ? 'white' : '#94a3b8', fontWeight: 'bold' }}>
                        {msg.sender}
                      </Typography>
                      <Typography variant="caption" sx={{ color: msg.isCurrentUser ? 'rgba(255,255,255,0.7)' : '#94a3b8', ml: 2 }}>
                        {msg.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {msg.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* 消息输入 */}
            <Box sx={{ p: 2, borderTop: '1px solid #333' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <IconButton size="small" sx={{ color: '#94a3b8' }}>
                  <AttachFileIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: '#94a3b8' }}>
                  <ImageIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="输入消息..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    color: 'white',
                    '& fieldset': { borderColor: '#444' },
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1, bgcolor: '#2563eb' }}
                onClick={handleSendMessage}
              >
                发送
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2 }}>
              团队标注
            </Typography>
            {drawings.map((drawing) => (
              <Box
                key={drawing.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  bgcolor: '#333',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                {drawing.type === 'circle' ? (
                  <CircleIcon sx={{ color: drawing.color, fontSize: 18 }} />
                ) : (
                  <SquareIcon sx={{ color: drawing.color, fontSize: 18 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {drawing.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {drawing.author}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
