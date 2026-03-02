'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Cpu,
  Database,
  Network,
  AlertTriangle,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function MonitoringPage() {
  const [alerts] = useState([
    { id: '1', name: 'CPU使用率告警', metric: 'CPU', threshold: '80%', current: '45%', status: 'normal' },
    { id: '2', name: '内存使用告警', metric: 'Memory', threshold: '85%', current: '92%', status: 'critical' },
    { id: '3', name: 'AI响应超时', metric: 'ResponseTime', threshold: '5s', current: '6.2s', status: 'warning' }
  ])

  const [cpuHistory, setCpuHistory] = useState<number[]>([42, 45, 43, 48, 45, 47, 45, 46, 44, 45])
  const [memoryHistory, setMemoryHistory] = useState<number[]>([88, 89, 90, 91, 92, 91, 92, 92, 91, 92])
  const [networkHistory, setNetworkHistory] = useState<number[]>([35, 38, 36, 40, 38, 42, 38, 39, 37, 38])

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuHistory(prev => [...prev.slice(1), 40 + Math.random() * 10])
      setMemoryHistory(prev => [...prev.slice(1), 88 + Math.random() * 6])
      setNetworkHistory(prev => [...prev.slice(1), 35 + Math.random() * 8])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">监控告警</h1>
            <p className="text-muted-foreground mt-1">实时监控系统状态和告警规则管理</p>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            新建告警规则
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CPU使用率</p>
                  <p className="text-3xl font-bold text-foreground mt-2">45%</p>
                </div>
                <div className="p-3 bg-success-light rounded-xl">
                  <Cpu className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">内存使用</p>
                  <p className="text-3xl font-bold text-foreground mt-2">92%</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <Database className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">网络带宽</p>
                  <p className="text-3xl font-bold text-foreground mt-2">38%</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <Network className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃告警</p>
                  <p className="text-3xl font-bold text-foreground mt-2">2</p>
                </div>
                <div className="p-3 bg-warning-light rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 实时监控图表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CPU使用率趋势 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                CPU使用率趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-1">
                {cpuHistory.map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary rounded-t transition-all duration-500"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>10分钟前</span>
                <span className="font-semibold text-foreground">{cpuHistory[cpuHistory.length - 1].toFixed(1)}%</span>
                <span>现在</span>
              </div>
            </CardContent>
          </Card>

          {/* 内存使用趋势 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-destructive" />
                内存使用趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-1">
                {memoryHistory.map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-destructive rounded-t transition-all duration-500"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>10分钟前</span>
                <span className="font-semibold text-foreground">{memoryHistory[memoryHistory.length - 1].toFixed(1)}%</span>
                <span>现在</span>
              </div>
            </CardContent>
          </Card>

          {/* 网络带宽趋势 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="w-4 h-4 text-accent" />
                网络带宽趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-1">
                {networkHistory.map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-accent rounded-t transition-all duration-500"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>10分钟前</span>
                <span className="font-semibold text-foreground">{networkHistory[networkHistory.length - 1].toFixed(1)}%</span>
                <span>现在</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>告警规则列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      alert.status === 'critical' ? 'bg-destructive/10' :
                      alert.status === 'warning' ? 'bg-warning-light' : 'bg-success-light'
                    }`}>
                      <Bell className={`w-5 h-5 ${
                        alert.status === 'critical' ? 'text-destructive' :
                        alert.status === 'warning' ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">
                        阈值: {alert.threshold} | 当前: {alert.current}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-muted rounded-lg"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-muted rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
