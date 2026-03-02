"""
大语言模型路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time
import uuid
from loguru import logger

from app.utils.response import success_response, error_response
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()


class ChatMessage(BaseModel):
    """聊天消息"""
    role: str = Field(..., description="角色: system/user/assistant")
    content: str = Field(..., description="消息内容")


class ChatRequest(BaseModel):
    """聊天请求"""
    messages: List[ChatMessage] = Field(..., description="消息列表")
    model: str = Field(default="gpt-4", description="模型名称")
    temperature: float = Field(default=0.7, ge=0, le=2, description="温度参数")
    max_tokens: int = Field(default=2048, ge=1, le=8192, description="最大Token数")
    stream: bool = Field(default=False, description="是否流式输出")


class ReportGenerateRequest(BaseModel):
    """医疗报告生成请求"""
    template_type: str = Field(..., description="报告模板类型")
    patient_info: Dict[str, Any] = Field(..., description="患者信息")
    examination_data: Dict[str, Any] = Field(..., description="检查数据")
    findings: List[str] = Field(default=[], description="检查发现")


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    通用聊天接口
    
    支持多轮对话，可用于医疗问诊、报告解读等场景
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Chat request {request_id}: model={request.model}")
        
        response = await llm_service.chat(
            messages=[m.model_dump() for m in request.messages],
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "model": request.model,
            "content": response["content"],
            "usage": response.get("usage", {}),
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/report/generate")
async def generate_report(request: ReportGenerateRequest):
    """
    医疗报告生成
    
    根据检查数据和模板自动生成医疗报告
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Report generation {request_id}: template={request.template_type}")
        
        report = await llm_service.generate_medical_report(
            template_type=request.template_type,
            patient_info=request.patient_info,
            examination_data=request.examination_data,
            findings=request.findings
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "report": report,
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize")
async def summarize_medical_text(text: str, max_length: int = 500):
    """
    医疗文本摘要
    
    对长篇医疗文本进行智能摘要
    """
    try:
        summary = await llm_service.summarize(text, max_length)
        return success_response({"summary": summary})
    except Exception as e:
        logger.error(f"Summarize error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
