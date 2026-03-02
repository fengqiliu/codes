"""
大语言模型服务
"""

from typing import List, Dict, Any, Optional
from loguru import logger
from openai import AsyncOpenAI

from app.config import settings


class LLMService:
    """大语言模型服务"""
    
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> Dict[str, Any]:
        """
        聊天对话
        """
        if not self.client:
            # 模拟响应
            return self._mock_chat_response(messages)
        
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return {
                "content": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._mock_chat_response(messages)
    
    async def generate_medical_report(
        self,
        template_type: str,
        patient_info: Dict[str, Any],
        examination_data: Dict[str, Any],
        findings: List[str]
    ) -> Dict[str, Any]:
        """
        生成医疗报告
        """
        # 构建提示
        prompt = self._build_report_prompt(
            template_type, patient_info, examination_data, findings
        )
        
        messages = [
            {"role": "system", "content": "你是一个专业的医疗报告生成助手，请根据提供的检查数据生成规范的医疗报告。"},
            {"role": "user", "content": prompt}
        ]
        
        response = await self.chat(messages, temperature=0.3, max_tokens=4096)
        
        return {
            "template_type": template_type,
            "content": response["content"],
            "generated_at": "2026-01-15 12:00:00"
        }
    
    async def summarize(self, text: str, max_length: int = 500) -> str:
        """
        文本摘要
        """
        messages = [
            {"role": "system", "content": f"请将以下医疗文本进行摘要，控制在{max_length}字以内，保留关键医学信息。"},
            {"role": "user", "content": text}
        ]
        
        response = await self.chat(messages, temperature=0.3)
        return response["content"]
    
    def _build_report_prompt(
        self,
        template_type: str,
        patient_info: Dict[str, Any],
        examination_data: Dict[str, Any],
        findings: List[str]
    ) -> str:
        """构建报告生成提示"""
        prompt = f"""
请根据以下信息生成{template_type}报告：

患者信息：
{self._format_dict(patient_info)}

检查数据：
{self._format_dict(examination_data)}

检查发现：
{chr(10).join(f'- {f}' for f in findings)}

请生成规范的医疗报告，包括：
1. 检查所见
2. 诊断意见
3. 建议
"""
        return prompt
    
    def _format_dict(self, d: Dict[str, Any]) -> str:
        """格式化字典为字符串"""
        return "\n".join(f"- {k}: {v}" for k, v in d.items())
    
    def _mock_chat_response(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """模拟聊天响应（用于测试）"""
        user_message = messages[-1]["content"] if messages else ""
        
        return {
            "content": f"这是一个模拟响应。您的问题是：{user_message[:100]}...\n\n作为医疗AI助手，我建议您咨询专业医生获取准确诊断。",
            "usage": {
                "prompt_tokens": 100,
                "completion_tokens": 50,
                "total_tokens": 150
            }
        }
