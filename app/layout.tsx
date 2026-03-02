import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '医学影像AI集成平台 V2.0 | 企业级AI能力中台',
  description: '医学影像AI集成平台是面向医疗行业的企业级AI能力中台，提供统一的AI模型接入、标准化接口规范、智能调度等核心功能，简化医院HIS/RIS系统与影像云平台的AI能力调用流程。',
  keywords: '医学影像,AI平台,医疗AI,影像诊断,智能调度,HIS系统,RIS系统,医疗影像处理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
