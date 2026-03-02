'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, CardHeader, Grid, TextField,
  Switch, FormControlLabel, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import BusinessIcon from '@mui/icons-material/Business'
import SecurityIcon from '@mui/icons-material/Security'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import NotificationsIcon from '@mui/icons-material/Notifications'
import BoltIcon from '@mui/icons-material/Bolt'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'

const settingsSections = [
  { id: 'basic', title: '基本信息', description: '系统名称、Logo、版权等信息', icon: BusinessIcon },
  { id: 'security', title: '安全配置', description: '会话超时、密码策略、登录限制', icon: SecurityIcon },
  { id: 'upload', title: '文件上传', description: '文件大小限制和允许的文件类型', icon: CloudUploadIcon },
  { id: 'notification', title: '通知配置', description: '邮件、短信通知设置', icon: NotificationsIcon },
  { id: 'business', title: '业务参数', description: 'AI超时、并发、QPS限制', icon: BoltIcon },
  { id: 'features', title: '功能开关', description: '模块功能的启用和禁用', icon: ToggleOnIcon }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('basic')

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">系统设置</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>配置系统各项参数</Typography>
        </Box>
        <Button variant="contained" startIcon={<SaveIcon />}>保存设置</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <List>
              {settingsSections.map((section) => (
                <ListItem key={section.id} disablePadding>
                  <ListItemButton
                    selected={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon><section.icon /></ListItemIcon>
                    <ListItemText primary={section.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Card>
            <CardContent>
              {activeSection === 'basic' && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>基本信息</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="系统名称" defaultValue="医学影像AI集成平台" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="系统版本" defaultValue="V2.0" disabled />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label="版权信息" defaultValue="© 2024 医院名称" />
                    </Grid>
                  </Grid>
                </Box>
              )}
              {activeSection === 'security' && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>安全配置</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="会话超时时间" defaultValue="30分钟" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="密码最小长度" defaultValue="8位" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel control={<Switch defaultChecked />} label="启用双因素认证" />
                    </Grid>
                  </Grid>
                </Box>
              )}
              {activeSection === 'features' && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>功能开关</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel control={<Switch defaultChecked />} label="启用AI模型管理" />
                    <FormControlLabel control={<Switch defaultChecked />} label="启用工作流引擎" />
                    <FormControlLabel control={<Switch defaultChecked />} label="启用API网关" />
                    <FormControlLabel control={<Switch />} label="启用审计日志" />
                  </Box>
                </Box>
              )}
              {(activeSection === 'upload' || activeSection === 'notification' || activeSection === 'business') && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    {settingsSections.find(s => s.id === activeSection)?.title}
                  </Typography>
                  <Typography color="text.secondary">该功能模块正在完善中...</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
