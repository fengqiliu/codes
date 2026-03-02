"""
语音服务路由
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional
import time
import uuid
import base64
from loguru import logger

from app.utils.response import success_response
from app.services.voice_service import VoiceService

router = APIRouter()
voice_service = VoiceService()


class TranscribeRequest(BaseModel):
    """语音转写请求"""
    audio_data: str = Field(..., description="音频数据(base64编码)")
    audio_format: str = Field(default="wav", description="音频格式: wav/mp3/m4a")
    language: str = Field(default="zh-CN", description="语言")
    enable_punctuation: bool = Field(default=True, description="启用标点")
    enable_medical_terms: bool = Field(default=True, description="启用医学术语识别")


class SynthesizeRequest(BaseModel):
    """语音合成请求"""
    text: str = Field(..., description="要合成的文本")
    voice: str = Field(default="female", description="声音类型: male/female")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="语速")
    output_format: str = Field(default="mp3", description="输出格式")


@router.post("/transcribe")
async def transcribe_audio(request: TranscribeRequest):
    """
    语音转写
    
    将医疗场景语音转换为文本，支持医学术语识别
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Transcribe request {request_id}")
        
        result = await voice_service.transcribe(
            audio_data=request.audio_data,
            audio_format=request.audio_format,
            language=request.language,
            enable_punctuation=request.enable_punctuation,
            enable_medical_terms=request.enable_medical_terms
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "text": result["text"],
            "segments": result.get("segments", []),
            "medical_terms": result.get("medical_terms", []),
            "confidence": result.get("confidence", 0.95),
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Transcribe error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/synthesize")
async def synthesize_speech(request: SynthesizeRequest):
    """
    语音合成
    
    将文本转换为语音，适用于报告朗读等场景
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Synthesize request {request_id}")
        
        audio_data = await voice_service.synthesize(
            text=request.text,
            voice=request.voice,
            speed=request.speed,
            output_format=request.output_format
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "audio_data": audio_data,
            "format": request.output_format,
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Synthesize error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-transcribe")
async def upload_and_transcribe(
    file: UploadFile = File(...),
    language: str = "zh-CN",
    enable_medical_terms: bool = True
):
    """
    上传音频并转写
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Upload transcribe {request_id}: {file.filename}")
        
        content = await file.read()
        audio_data = base64.b64encode(content).decode()
        
        # 获取格式
        audio_format = file.filename.split(".")[-1].lower()
        
        result = await voice_service.transcribe(
            audio_data=audio_data,
            audio_format=audio_format,
            language=language,
            enable_punctuation=True,
            enable_medical_terms=enable_medical_terms
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "filename": file.filename,
            "text": result["text"],
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Upload transcribe error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
