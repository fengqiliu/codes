'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Brain,
  Server,
  Zap,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Database,
  Network,
  Eye,
  Mic,
  FileText,
  Image,
  Menu,
  X,
  Home,
  Layers,
  Shield,
  Users,
  HelpCircle,
  LogOut,
  Workflow,
  GitBranch,
  FileSearch
} from 'lucide-react'

// 模拟数据
const statsData = [
  { 
    title: '今日调用量', 
    value: '128,456', 
    change: '+12.5%', 
    trend: 'up', 
    icon: Activity,
    color: 'primary'
  },
  { 
    title: '在线模型数', 
    value: '24', 
    change: '+2', 
    trend: 'up', 
    icon: Brain,
    color: 'accent'
  },
  { 
    title: '平均响应时间', 
    value: '186ms', 
    change: '-8.2%', 
    trend: 'down', 
    icon: Zap,
    color: 'secondary'
  },
  { 
    title: '系统可用率', 
    value: '99.97%', 
    change: '+0.02%', 
    trend: 'up', 
    icon: Server,
    color: 'success'
  },
]

const aiModels = [
  { 
    name: '肺结节智能筛查', 
    type: '影像诊断', 
    status: 'online', 
    calls: '45,230',
    accuracy: '98.5%',
    icon: Eye
  },
  { 
    name: '医疗报告生成', 
    type: '大语言模型', 
    status: 'online', 
    calls: '32,180',
    accuracy: '96.8%',
    icon: FileText
  },
  { 
    name: '病理切片分析', 
    type: '图像识别', 
    status: 'online', 
    calls: '28,650',
    accuracy: '97.2%',
    icon: Image
  },
  { 
    name: '语音病历转写', 
    type: '语音合成', 
    status: 'maintenance', 
    calls: '15,420',
    accuracy: '94.6%',
    icon: Mic
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
  { name: 'CPU使用率', value: 45, icon: Cpu },
  { name: '内存使用', value: 62, icon: Database },
  { name: '网络带宽', value: 38, icon: Network },
]

const sidebarItems = [
  { name: '控制台', icon: Home, active: true, path: '/' },
  { name: 'AI模型管理', icon: Brain, active: false, path: '/models' },
  { name: '流程编排', icon: Workflow, active: false, path: '/workflows' },
  { name: '用户管理', icon: Users, active: false, path: '/users' },
  { name: 'API网关', icon: Layers, active: false, path: '/gateway' },
  { name: '系统监控', icon: Activity, active: false, path: '/monitoring' },
  { name: '日志审计', icon: FileSearch, active: false, path: '/audit' },
  { name: '系统设置', icon: Settings, active: false, path: '/settings' },
]

const quickActions = [
  { name: '接入新模型', icon: Brain, color: 'primary', path: '/models' },
  { name: '创建流程', icon: GitBranch, color: 'accent', path: '/workflows/editor' },
  { name: '调用报表', icon: BarChart3, color: 'success', path: '/monitoring' },
  { name: '安全审计', icon: Shield, color: 'warning', path: '/audit' },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('控制台')

  return (
    <div className="min-h-screen bg-background">
      {/* 侧边栏 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">医学影像AI</h1>
              <p className="text-xs text-muted-foreground">集成平台 V2.0</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden p-1 hover:bg-muted rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeNav === item.name
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* 底部 */}
          <div className="p-4 border-t space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <HelpCircle className="w-5 h-5" />
              帮助中心
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="w-5 h-5" />
              退出登录
            </button>
          </div>
        </div>
      </aside>
      
      {/* 遮罩层 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 主内容区 */}
      <div className="lg:ml-64">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="搜索模型、接口、文档..."
                  className="w-64 lg:w-80 h-10 pl-10 pr-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="ml-2 flex items-center gap-3 pl-4 border-l">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  管
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">系统管理员</p>
                  <p className="text-xs text-muted-foreground">admin@hospital.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* 页面内容 */}
        <main className="p-4 lg:p-6 space-y-6">
          {/* 页面标题 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">控制台</h2>
              <p className="text-muted-foreground mt-1">欢迎回来，查看平台运行状态和关键指标</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                最近7天
              </Button>
              <Button variant="gradient" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                快速接入
              </Button>
            </div>
          </div>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <Card key={index} className="card-hover overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <div className={`inline-flex items-center gap-1 text-xs font-medium ${
                        stat.trend === 'up' ? 'text-success' : 'text-secondary'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      stat.color === 'primary' ? 'bg-primary-light' :
                      stat.color === 'accent' ? 'bg-accent-light' :
                      stat.color === 'secondary' ? 'bg-muted' :
                      'bg-success-light'
                    }`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.color === 'primary' ? 'text-primary' :
                        stat.color === 'accent' ? 'text-accent' :
                        stat.color === 'secondary' ? 'text-secondary' :
                        'text-success'
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI模型状态 */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI模型运行状态</CardTitle>
                    <CardDescription>已接入的核心AI能力概览</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看全部
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiModels.map((model, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-card rounded-xl shadow-sm">
                          <model.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{model.name}</h4>
                          <p className="text-sm text-muted-foreground">{model.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium text-foreground">{model.calls}</p>
                          <p className="text-xs text-muted-foreground">今日调用</p>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-medium text-foreground">{model.accuracy}</p>
                          <p className="text-xs text-muted-foreground">准确率</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          model.status === 'online' 
                            ? 'bg-success-light text-success' 
                            : 'bg-warning-light text-warning'
                        }`}>
                          {model.status === 'online' ? '运行中' : '维护中'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* 系统资源 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>系统资源监控</CardTitle>
                <CardDescription>实时资源使用情况</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{metric.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          metric.value > 70 ? 'bg-warning' : 'bg-primary'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">服务器状态</span>
                    <span className="flex items-center gap-1.5 text-success font-medium">
                      <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      正常运行
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 底部区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近活动 */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>最近活动</CardTitle>
                    <CardDescription>系统运行日志和事件</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看全部
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-full ${
                        activity.type === 'success' ? 'bg-success-light' :
                        activity.type === 'warning' ? 'bg-warning-light' :
                        'bg-muted'
                      }`}>
                        {activity.type === 'success' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        ) : activity.type === 'warning' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-warning" />
                        ) : (
                          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.event}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* 快速操作 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>快速操作</CardTitle>
                <CardDescription>常用功能入口</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.name}
                        href={action.path}
                        className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-all hover:scale-[1.02]"
                      >
                        <div className={`p-3 bg-${action.color}-light rounded-xl`}>
                          <Icon className={`w-6 h-6 text-${action.color}`} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{action.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
