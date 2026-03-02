'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function AuditPage() {
  const [logs] = useState([
    { id: '1', user: '张医生', action: '登录系统', type: 'security', time: '2024-01-19 10:23:15', ip: '192.168.1.100', status: 'success' },
    { id: '2', user: '李护士', action: '查询患者影像', type: 'business', time: '2024-01-19 10:20:08', ip: '192.168.1.101', status: 'success' },
    { id: '3', user: '王主任', action: '修改系统配置', type: 'operation', time: '2024-01-19 10:15:42', ip: '192.168.1.102', status: 'success' },
    { id: '4', user: '未知用户', action: '尝试访问管理接口', type: 'security', time: '2024-01-19 10:10:30', ip: '203.0.113.45', status: 'failed' }
  ])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">日志审计</h1>
            <p className="text-muted-foreground mt-1">查询和分析系统操作日志</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出日志
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日操作</p>
                  <p className="text-3xl font-bold text-foreground mt-2">1,248</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">安全事件</p>
                  <p className="text-3xl font-bold text-foreground mt-2">3</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">成功率</p>
                  <p className="text-3xl font-bold text-foreground mt-2">99.7%</p>
                </div>
                <div className="p-3 bg-success-light rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃用户</p>
                  <p className="text-3xl font-bold text-foreground mt-2">42</p>
                </div>
                <div className="p-3 bg-accent-light rounded-xl">
                  <User className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>操作日志</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索日志..."
                  className="w-64 h-9 pl-10 pr-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">时间</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">用户</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">操作</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IP地址</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">状态</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {log.time}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{log.user}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{log.action}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          log.type === 'security' ? 'bg-destructive/10 text-destructive' :
                          log.type === 'business' ? 'bg-primary-light text-primary' :
                          'bg-accent-light text-accent'
                        }`}>
                          {log.type === 'security' ? '安全' : log.type === 'business' ? '业务' : '操作'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{log.ip}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          log.status === 'success' ? 'bg-success-light text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {log.status === 'success' ? '成功' : '失败'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-2 hover:bg-muted rounded-lg">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
