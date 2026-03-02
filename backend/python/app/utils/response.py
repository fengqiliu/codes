"""
响应工具函数
"""

from typing import Any, Optional
import time


def success_response(data: Any = None, message: str = "success") -> dict:
    """成功响应"""
    return {
        "code": 0,
        "message": message,
        "data": data,
        "timestamp": int(time.time() * 1000)
    }


def error_response(code: int, message: str, details: Optional[str] = None) -> dict:
    """错误响应"""
    response = {
        "code": code,
        "message": message,
        "timestamp": int(time.time() * 1000)
    }
    if details:
        response["details"] = details
    return response
