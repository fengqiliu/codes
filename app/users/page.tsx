'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Shield,
  Mail,
  Phone,
  Calendar,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react'

interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string
  department: string
  role: string
  status: 'active' | 'inactive' | 'locked'
  lastLogin: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: '张医生',
    username: 'zhangdoc',
    email: 'zhang.doc@hospital.com',
    phone: '138****1234',
    department: '影像科',
    role: 'MODEL_MANAGER',
    status: 'active',
    lastLogin: '2小时前',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: '李护士',
    username: 'linurse',
    email: 'li.nurse@hospital.com',
    phone: '139****5678',
    department: '放射科',
    role: 'API_USER',
    status: 'active',
    lastLogin: '1天前',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: '王主任',
    username: 'wangadmin',
    email: 'wang.admin@hospital.com',
    phone: '137****9012',
    department: '信息科',
    role: 'ADMIN',
    status: 'active',
    lastLogin: '5分钟前',
    createdAt: '2023-12-01'
  },
  {
    id: '4',
    name: '赵审计',
    username: 'zhaoaudit',
    email: 'zhao.audit@hospital.com',
    phone: '136****3456',
    department: '审计部',
    role: 'AUDITOR',
    status: 'inactive',
    lastLogin: '7天前',
    createdAt: '2024-03-10'
  }
]

const roleLabels: Record<string, { label: string, color: string }> = {
  SUPER_ADMIN: { label: '超级管理员', color: 'bg-destructive text-destructive-foreground' },
  ADMIN: { label: '系统管理员', color: 'bg-primary text-primary-foreground' },
  MODEL_MANAGER: { label: '模型管理员', color: 'bg-accent text-accent-foreground' },
  API_USER: { label: 'API用户', color: 'bg-secondary text-secondary-foreground' },
  AUDITOR: { label: '审计员', color: 'bg-warning text-warning-foreground' },
  GUEST: { label: '访客', color: 'bg-muted text-muted-foreground' }
}

const statusConfig = {
  active: { label: '正常', icon: CheckCircle2, color: 'text-success bg-success-light' },
  inactive: { label: '停用', icon: XCircle, color: 'text-muted-foreground bg-muted' },
  locked: { label: '锁定', icon: AlertCircle, color: 'text-destructive bg-destructive/10' }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    department: '',
    role: 'API_USER',
    password: ''
  })

  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm) ||
    user.username.includes(searchTerm) ||
    user.email.includes(searchTerm) ||
    user.department.includes(searchTerm)
  )

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)))
    }
  }

  const handleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedUsers(newSelected)
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('确定要删除该用户吗?此操作不可撤销。')) {
      setUsers(users.filter(u => u.id !== id))
      selectedUsers.delete(id)
      setSelectedUsers(new Set(selectedUsers))
    }
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' } 
        : u
    ))
  }

  const handleBatchExport = () => {
    alert(`导出 ${selectedUsers.size} 个用户数据`)
  }

  const handleBatchImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`正在导入文件: ${file.name}`)
      }
    }
    input.click()
  }

  const handleAddUser = () => {
    if (!formData.name || !formData.username || !formData.email) {
      alert('请填写必填字段')
      return
    }
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      role: formData.role,
      status: 'active',
      lastLogin: '从未登录',
      createdAt: new Date().toISOString().split('T')[0]
    }
    setUsers([newUser, ...users])
    setShowAddModal(false)
    setFormData({ name: '', username: '', email: '', phone: '', department: '', role: 'API_USER', password: '' })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      department: user.department,
      role: user.role,
      password: ''
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingUser) return
    setUsers(users.map(u => 
      u.id === editingUser.id 
        ? { ...u, ...formData }
        : u
    ))
    setShowEditModal(false)
    setEditingUser(null)
    setFormData({ name: '', username: '', email: '', phone: '', department: '', role: 'API_USER', password: '' })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">用户管理</h1>
            <p className="text-muted-foreground mt-1">管理系统用户、角色权限和组织架构</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBatchImport}>
              <Upload className="w-4 h-4 mr-2" />
              批量导入
            </Button>
            <Button variant="outline" size="sm" onClick={handleBatchExport} disabled={selectedUsers.size === 0}>
              <Download className="w-4 h-4 mr-2" />
              导出用户
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              新建用户
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总用户数</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{users.length}</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">在线用户</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{users.filter(u => u.status === 'active').length}</p>
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
                  <p className="text-sm text-muted-foreground">停用用户</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{users.filter(u => u.status === 'inactive').length}</p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <XCircle className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">管理员数</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
                  </p>
                </div>
                <div className="p-3 bg-accent-light rounded-xl">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容 */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>用户列表</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="搜索用户..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 h-9 pl-10 pr-4 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {selectedUsers.size > 0 && (
              <div className="mb-4 p-3 bg-primary-light rounded-lg flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  已选择 {selectedUsers.size} 个用户
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedUsers(new Set())}>
                    取消选择
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => {
                    if (confirm(`确定要删除选中的 ${selectedUsers.size} 个用户吗?`)) {
                      setUsers(users.filter(u => !selectedUsers.has(u.id)))
                      setSelectedUsers(new Set())
                    }
                  }}>
                    批量删除
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-input accent-primary"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">用户信息</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">联系方式</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">部门</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">最后登录</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const StatusIcon = statusConfig[user.status].icon
                    return (
                      <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="w-4 h-4 rounded border-input accent-primary"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-foreground">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground">{user.department}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleLabels[user.role]?.color || 'bg-muted text-muted-foreground'}`}>
                            {roleLabels[user.role]?.label || user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[user.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[user.status].label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {user.lastLogin}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title={user.status === 'active' ? '停用用户' : '启用用户'}
                            >
                              {user.status === 'active' ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Unlock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="编辑用户"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              title="删除用户"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                            <button
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="更多操作"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">没有找到匹配的用户</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 新建用户弹窗 */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>新建用户</DialogTitle>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <DialogDescription>填写用户基本信息创建新账号</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    姓名 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="请输入姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    用户名 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="请输入用户名"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  邮箱 <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">电话</label>
                  <Input
                    placeholder="请输入电话"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">部门</label>
                  <Input
                    placeholder="请输入部门"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">角色</label>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="SUPER_ADMIN">超级管理员</option>
                    <option value="ADMIN">系统管理员</option>
                    <option value="MODEL_MANAGER">模型管理员</option>
                    <option value="API_USER">API用户</option>
                    <option value="AUDITOR">审计员</option>
                    <option value="GUEST">访客</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    初始密码 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="请输入初始密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleAddUser}>
                创建用户
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 编辑用户弹窗 */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>编辑用户</DialogTitle>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <DialogDescription>修改用户信息</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">姓名</label>
                  <Input
                    placeholder="请输入姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">用户名</label>
                  <Input
                    placeholder="请输入用户名"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled
                    className="opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">邮箱</label>
                <Input
                  type="email"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">电话</label>
                  <Input
                    placeholder="请输入电话"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">部门</label>
                  <Input
                    placeholder="请输入部门"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">角色</label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="SUPER_ADMIN">超级管理员</option>
                  <option value="ADMIN">系统管理员</option>
                  <option value="MODEL_MANAGER">模型管理员</option>
                  <option value="API_USER">API用户</option>
                  <option value="AUDITOR">审计员</option>
                  <option value="GUEST">访客</option>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  重置密码 <span className="text-xs text-muted-foreground">(留空则不修改)</span>
                </label>
                <Input
                  type="password"
                  placeholder="请输入新密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveEdit}>
                保存修改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
