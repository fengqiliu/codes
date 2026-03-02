'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GitBranch,
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Shield,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react'

export default function GatewayPage() {
  const [routes] = useState([
    { id: '1', path: '/api/v1/ai/*', target: 'http://ai-service:8080', method: 'ALL', status: 'active', qps: 120 },
    { id: '2', path: '/api/v1/workflow/*', target: 'http://workflow:8081', method: 'ALL', status: 'active', qps: 85 },
    { id: '3', path: '/api/v1/report/*', target: 'http://report:8082', method: 'GET,POST', status: 'inactive', qps: 0 }
  ])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">API网关</h1>
            <p className="text-muted-foreground mt-1">统一管理API路由、限流和安全策略</p>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            新建路由
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总路由数</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{routes.length}</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <GitBranch className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃路由</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {routes.filter(r => r.status === 'active').length}
                  </p>
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
                  <p className="text-sm text-muted-foreground">总QPS</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {routes.reduce((sum, r) => sum + r.qps, 0)}
                  </p>
                </div>
                <div className="p-3 bg-accent-light rounded-xl">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">安全策略</p>
                  <p className="text-3xl font-bold text-foreground mt-2">8</p>
                </div>
                <div className="p-3 bg-warning-light rounded-xl">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>路由配置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routes.map(route => (
                <div key={route.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground font-mono text-sm">{route.path}</p>
                      <p className="text-sm text-muted-foreground">→ {route.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{route.qps} QPS</p>
                      <p className="text-xs text-muted-foreground">{route.method}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      route.status === 'active' ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {route.status === 'active' ? '运行中' : '已停用'}
                    </span>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      {route.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
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
