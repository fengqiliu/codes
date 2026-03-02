'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

export default function DictionaryPage() {
  const [dictionaries] = useState([
    { id: '1', type: 'user_status', label: '用户状态', items: 3, status: 'active' },
    { id: '2', type: 'model_type', label: '模型类型', items: 5, status: 'active' },
    { id: '3', type: 'device_type', label: '设备类型', items: 8, status: 'active' },
    { id: '4', type: 'exam_type', label: '检查类型', items: 12, status: 'inactive' }
  ])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">字典管理</h1>
            <p className="text-muted-foreground mt-1">维护系统标准化数据字典</p>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            新建字典
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">字典类型</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{dictionaries.length}</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">字典项</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {dictionaries.reduce((sum, d) => sum + d.items, 0)}
                  </p>
                </div>
                <div className="p-3 bg-accent-light rounded-xl">
                  <Tag className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">启用中</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {dictionaries.filter(d => d.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-success-light rounded-xl">
                  <ToggleRight className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">缓存命中率</p>
                  <p className="text-3xl font-bold text-foreground mt-2">98.2%</p>
                </div>
                <div className="p-3 bg-warning-light rounded-xl">
                  <Tag className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>字典列表</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索字典..."
                  className="w-64 h-9 pl-10 pr-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dictionaries.map(dict => (
                <div key={dict.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{dict.label}</p>
                      <p className="text-sm text-muted-foreground font-mono">{dict.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{dict.items} 项</p>
                      <p className="text-xs text-muted-foreground">字典项数</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      dict.status === 'active' ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {dict.status === 'active' ? '启用' : '停用'}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
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
