"""
医学影像诊断路由
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time
import uuid
import base64
from loguru import logger

from app.utils.response import success_response
from app.services.image_service import ImageDiagnosisService

router = APIRouter()
image_service = ImageDiagnosisService()


class ImageInvokeRequest(BaseModel):
    """影像推理请求"""
    model_id: str = Field(..., description="模型ID")
    image_data: str = Field(..., description="图像数据(base64编码)")
    image_type: str = Field(default="dicom", description="图像类型: dicom/png/jpg")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="元数据")


class LungNoduleRequest(BaseModel):
    """肺结节筛查请求"""
    dicom_data: str = Field(..., description="DICOM数据(base64编码)")
    patient_id: Optional[str] = Field(default=None, description="患者ID")
    study_date: Optional[str] = Field(default=None, description="检查日期")
    sensitivity: float = Field(default=0.85, ge=0, le=1, description="检测灵敏度")


class PathologyRequest(BaseModel):
    """病理切片分析请求"""
    image_data: str = Field(..., description="切片图像(base64编码)")
    magnification: int = Field(default=40, description="放大倍数")
    analysis_type: str = Field(default="classification", description="分析类型")


@router.post("/invoke")
async def invoke_image_model(request: ImageInvokeRequest):
    """
    通用影像模型推理接口
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Image invoke {request_id}: model={request.model_id}")
        
        result = await image_service.invoke(
            model_id=request.model_id,
            image_data=request.image_data,
            image_type=request.image_type,
            metadata=request.metadata
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "model_id": request.model_id,
            "result": result,
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Image invoke error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/lung-nodule")
async def detect_lung_nodule(request: LungNoduleRequest):
    """
    肺结节智能筛查
    
    基于深度学习的CT影像肺结节自动检测与分析
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Lung nodule detection {request_id}")
        
        result = await image_service.detect_lung_nodule(
            dicom_data=request.dicom_data,
            sensitivity=request.sensitivity
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "nodules": result["nodules"],
            "nodule_count": len(result["nodules"]),
            "conclusion": result["conclusion"],
            "confidence": result["confidence"],
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Lung nodule detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pathology")
async def analyze_pathology(request: PathologyRequest):
    """
    病理切片分析
    
    AI辅助病理切片诊断
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Pathology analysis {request_id}")
        
        result = await image_service.analyze_pathology(
            image_data=request.image_data,
            magnification=request.magnification,
            analysis_type=request.analysis_type
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "analysis": result,
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Pathology analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_and_analyze(
    file: UploadFile = File(...),
    model_id: str = Form(...),
    analysis_params: Optional[str] = Form(default=None)
):
    """
    上传文件并分析
    
    支持直接上传DICOM文件或图像文件进行分析
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    try:
        logger.info(f"File upload analysis {request_id}: {file.filename}")
        
        # 读取文件内容
        content = await file.read()
        image_data = base64.b64encode(content).decode()
        
        # 判断文件类型
        image_type = "dicom" if file.filename.endswith(".dcm") else "image"
        
        result = await image_service.invoke(
            model_id=model_id,
            image_data=image_data,
            image_type=image_type,
            metadata={"filename": file.filename}
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return success_response({
            "request_id": request_id,
            "filename": file.filename,
            "result": result,
            "processing_time": processing_time
        })
        
    except Exception as e:
        logger.error(f"Upload analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
