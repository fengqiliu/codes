"""
医学影像AI集成平台 - Python AI服务
主入口文件
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
import uuid
from loguru import logger

from app.config import settings
from app.routers import llm, image_diagnosis, voice
from app.utils.response import success_response, error_response

# 配置日志
logger.add(
    "logs/ai_service_{time}.log",
    rotation="100 MB",
    retention="7 days",
    level="INFO"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("AI Service starting...")
    # 初始化模型
    # await load_models()
    yield
    logger.info("AI Service shutting down...")
    # 清理资源


app = FastAPI(
    title="医学影像AI服务",
    description="提供医学影像AI推理能力，包括LLM、影像诊断、图像识别、语音处理等",
    version="2.0.0",
    lifespan=lifespan
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """添加请求处理时间和追踪ID"""
    start_time = time.time()
    request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))
    
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
    response.headers["X-Request-Id"] = request_id
    
    logger.info(f"Request {request.method} {request.url.path} - {process_time:.2f}ms")
    
    return response


# 注册路由
app.include_router(llm.router, prefix="/llm", tags=["大语言模型"])
app.include_router(image_diagnosis.router, prefix="/image", tags=["医学影像诊断"])
app.include_router(voice.router, prefix="/voice", tags=["语音服务"])


@app.get("/")
async def root():
    """服务根路径"""
    return success_response({
        "service": "Medical AI Service",
        "version": "2.0.0",
        "status": "running"
    })


@app.get("/health")
async def health_check():
    """健康检查"""
    return success_response({
        "status": "healthy",
        "timestamp": time.time()
    })


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content=error_response(
            code=500,
            message=str(exc)
        )
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
