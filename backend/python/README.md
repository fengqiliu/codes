# 医学影像AI集成平台 - Python AI服务

## 服务说明
本服务提供AI模型推理能力，包括：
- 大语言模型(LLM)推理
- 医学影像诊断
- 图像识别
- 语音识别/合成

## 技术栈
- Python 3.11+
- FastAPI
- PyTorch / TensorFlow
- OpenAI API
- pydicom (DICOM处理)

## 目录结构
```
backend/python/
├── app/
│   ├── main.py          # 主入口
│   ├── config.py        # 配置
│   ├── models/          # AI模型
│   ├── routers/         # API路由
│   ├── services/        # 业务服务
│   └── utils/           # 工具函数
├── requirements.txt
└── Dockerfile
```

## 运行方式
```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
