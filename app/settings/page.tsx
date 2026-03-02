'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Settings,
  Building2,
  Shield,
  FileUp,
  Bell,
  Zap,
  Database,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Clock,
  HardDrive,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react'

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: any
}

const settingsSections: SettingsSection[] = [
  { id: 'basic', title: '基本信息', description: '系统名称、Logo、版权等信息', icon: Building2 },
  { id: 'security', title: '安全配置', description: '会话超时、密码策略、登录限制', icon: Shield },
  { id: 'upload', title: '文件上传', description: '文件大小限制和允许的文件类型', icon: FileUp },
  { id: 'notification', title: '通知配置', description: '邮件、短信通知设置', icon: Bell },
  { id: 'business', title: '业务参数', description: 'AI超时、并发、QPS限制', icon: Zap },
  { id: 'features', title: '功能开关', description: '模块功能的启用和禁用', icon: ToggleLeft }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [hasChanges, setHasChanges] = useState(false)

  // 基本信息设置
  const [basicSettings, setBasicSettings] = useState({
    systemName: '医学影像AI集成平台',
    systemVersion: 'V2.0',
    copyright: '© 2024 医疗AI科技有限公司',
    contactEmail: 'support@medical-ai.com',
    contactPhone: '400-123-4567'
  })

  // 安全配置
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumber: true,
    passwordExpireDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  })

  // 文件上传配置
  const [uploadSettings, setUploadSettings] = useState({
    maxFileSize: 100,
    allowedImageTypes: 'jpg,jpeg,png,gif,bmp,dcm',
    allowedDocTypes: 'pdf,doc,docx,xls,xlsx',
    uploadPath: '/data/uploads'
  })

  // 通知配置
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    emailServer: 'smtp.example.com',
    emailPort: 587,
    emailUser: 'noreply@medical-ai.com',
    smsEnabled: false,
    smsProvider: 'aliyun'
  })

  // 业务参数
  const [businessSettings, setBusinessSettings] = useState({
    aiTimeout: 30,
    maxConcurrency: 100,
    maxQPS: 1000,
    logRetentionDays: 180,
    cacheExpireMinutes: 60
  })

  // 功能开关
  const [featureToggles, setFeatureToggles] = useState({
    workflowEnabled: true,
    monitoringEnabled: true,
    auditEnabled: true,
    apiGatewayEnabled: true,
    autoBackup: true,
    advancedAnalytics: false
  })

  const handleSave = () => {
    alert('配置已保存')
    setHasChanges(false)
  }

  const handleReset = () => {
    if (confirm('确定要重置所有设置吗?')) {
      setHasChanges(false)
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">系统名称</label>
              <input
                type="text"
                value={basicSettings.systemName}
                onChange={(e) => {
                  setBasicSettings({ ...basicSettings, systemName: e.target.value })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">系统版本</label>
              <input
                type="text"
                value={basicSettings.systemVersion}
                onChange={(e) => {
                  setBasicSettings({ ...basicSettings, systemVersion: e.target.value })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">系统Logo</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 bg-primary-light rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <Button variant="outline" size="sm">
                  <FileUp className="w-4 h-4 mr-2" />
                  上传Logo
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">版权信息</label>
              <input
                type="text"
                value={basicSettings.copyright}
                onChange={(e) => {
                  setBasicSettings({ ...basicSettings, copyright: e.target.value })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">联系邮箱</label>
                <input
                  type="email"
                  value={basicSettings.contactEmail}
                  onChange={(e) => {
                    setBasicSettings({ ...basicSettings, contactEmail: e.target.value })
                    setHasChanges(true)
                  }}
                  className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">联系电话</label>
                <input
                  type="tel"
                  value={basicSettings.contactPhone}
                  onChange={(e) => {
                    setBasicSettings({ ...basicSettings, contactPhone: e.target.value })
                    setHasChanges(true)
                  }}
                  className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">会话超时时间(分钟)</label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => {
                  setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">密码最小长度</label>
              <input
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => {
                  setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={securitySettings.passwordRequireSpecial}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, passwordRequireSpecial: e.target.checked })
                    setHasChanges(true)
                  }}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-foreground">密码必须包含特殊字符</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={securitySettings.passwordRequireNumber}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, passwordRequireNumber: e.target.checked })
                    setHasChanges(true)
                  }}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-foreground">密码必须包含数字</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">密码有效期(天)</label>
                <input
                  type="number"
                  value={securitySettings.passwordExpireDays}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, passwordExpireDays: parseInt(e.target.value) })
                    setHasChanges(true)
                  }}
                  className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">最大登录失败次数</label>
                <input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })
                    setHasChanges(true)
                  }}
                  className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">账号锁定时长(分钟)</label>
              <input
                type="number"
                value={securitySettings.lockoutDuration}
                onChange={(e) => {
                  setSecuritySettings({ ...securitySettings, lockoutDuration: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )

      case 'upload':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">最大文件大小(MB)</label>
              <input
                type="number"
                value={uploadSettings.maxFileSize}
                onChange={(e) => {
                  setUploadSettings({ ...uploadSettings, maxFileSize: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">允许的图片格式</label>
              <input
                type="text"
                value={uploadSettings.allowedImageTypes}
                onChange={(e) => {
                  setUploadSettings({ ...uploadSettings, allowedImageTypes: e.target.value })
                  setHasChanges(true)
                }}
                placeholder="用逗号分隔,如:jpg,png,gif"
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">允许的文档格式</label>
              <input
                type="text"
                value={uploadSettings.allowedDocTypes}
                onChange={(e) => {
                  setUploadSettings({ ...uploadSettings, allowedDocTypes: e.target.value })
                  setHasChanges(true)
                }}
                placeholder="用逗号分隔,如:pdf,doc,xls"
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">上传文件存储路径</label>
              <input
                type="text"
                value={uploadSettings.uploadPath}
                onChange={(e) => {
                  setUploadSettings({ ...uploadSettings, uploadPath: e.target.value })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )

      case 'notification':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">邮件通知</p>
                <p className="text-sm text-muted-foreground">启用系统邮件通知功能</p>
              </div>
              <button
                onClick={() => {
                  setNotificationSettings({ ...notificationSettings, emailEnabled: !notificationSettings.emailEnabled })
                  setHasChanges(true)
                }}
                className="p-2"
              >
                {notificationSettings.emailEnabled ? (
                  <ToggleRight className="w-10 h-10 text-success" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-muted-foreground" />
                )}
              </button>
            </div>

            {notificationSettings.emailEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">SMTP服务器</label>
                    <input
                      type="text"
                      value={notificationSettings.emailServer}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, emailServer: e.target.value })
                        setHasChanges(true)
                      }}
                      className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">SMTP端口</label>
                    <input
                      type="number"
                      value={notificationSettings.emailPort}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, emailPort: parseInt(e.target.value) })
                        setHasChanges(true)
                      }}
                      className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">发送邮箱</label>
                  <input
                    type="email"
                    value={notificationSettings.emailUser}
                    onChange={(e) => {
                      setNotificationSettings({ ...notificationSettings, emailUser: e.target.value })
                      setHasChanges(true)
                    }}
                    className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">短信通知</p>
                <p className="text-sm text-muted-foreground">启用系统短信通知功能</p>
              </div>
              <button
                onClick={() => {
                  setNotificationSettings({ ...notificationSettings, smsEnabled: !notificationSettings.smsEnabled })
                  setHasChanges(true)
                }}
                className="p-2"
              >
                {notificationSettings.smsEnabled ? (
                  <ToggleRight className="w-10 h-10 text-success" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">AI调用超时时间(秒)</label>
              <input
                type="number"
                value={businessSettings.aiTimeout}
                onChange={(e) => {
                  setBusinessSettings({ ...businessSettings, aiTimeout: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">最大并发数</label>
              <input
                type="number"
                value={businessSettings.maxConcurrency}
                onChange={(e) => {
                  setBusinessSettings({ ...businessSettings, maxConcurrency: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">QPS限制</label>
              <input
                type="number"
                value={businessSettings.maxQPS}
                onChange={(e) => {
                  setBusinessSettings({ ...businessSettings, maxQPS: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">日志保留天数</label>
              <input
                type="number"
                value={businessSettings.logRetentionDays}
                onChange={(e) => {
                  setBusinessSettings({ ...businessSettings, logRetentionDays: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">缓存过期时间(分钟)</label>
              <input
                type="number"
                value={businessSettings.cacheExpireMinutes}
                onChange={(e) => {
                  setBusinessSettings({ ...businessSettings, cacheExpireMinutes: parseInt(e.target.value) })
                  setHasChanges(true)
                }}
                className="mt-2 w-full h-10 px-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-4">
            {Object.entries({
              workflowEnabled: '流程编排',
              monitoringEnabled: '系统监控',
              auditEnabled: '日志审计',
              apiGatewayEnabled: 'API网关',
              autoBackup: '自动备份',
              advancedAnalytics: '高级分析'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {featureToggles[key as keyof typeof featureToggles] ? '已启用' : '已禁用'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFeatureToggles({ ...featureToggles, [key]: !featureToggles[key as keyof typeof featureToggles] })
                    setHasChanges(true)
                  }}
                  className="p-2"
                >
                  {featureToggles[key as keyof typeof featureToggles] ? (
                    <ToggleRight className="w-10 h-10 text-success" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">系统设置</h1>
            <p className="text-muted-foreground mt-1">配置系统参数和功能开关</p>
          </div>
          {hasChanges && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存更改
              </Button>
            </div>
          )}
        </div>

        {/* 主内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {section.title}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* 右侧内容 */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>
                {settingsSections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <CardDescription>
                {settingsSections.find(s => s.id === activeSection)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSection()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
