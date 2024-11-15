from transformers import AutoProcessor, AutoModelForVisualQuestionAnswering
from PIL import Image
import torch
import requests
from io import BytesIO
import openai
from typing import Optional, Dict, Any

class QuestionAnalysisService:
    def __init__(self, openai_api_key: str):
        # OmniParser 초기화
        self.processor = AutoProcessor.from_pretrained("microsoft/OmniParser")
        self.model = AutoModelForVisualQuestionAnswering.from_pretrained("microsoft/OmniParser")
        
        # OpenAI 설정
        openai.api_key = openai_api_key
        
        # GPU 사용 가능시 GPU로 모델 이동
        if torch.cuda.is_available():
            self.model = self.model.to('cuda')
    
    def analyze_image(self, image_url: str, question: str) -> str:
        """OmniParser를 사용하여 이미지 분석"""
        try:
            # URL에서 이미지 로드
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content))
            
            # 입력 처리
            inputs = self.processor(images=image, text=question, return_tensors="pt")
            
            # GPU 사용시 입력도 GPU로
            if torch.cuda.is_available():
                inputs = {k: v.to('cuda') for k, v in inputs.items()}
            
            # 추론
            outputs = self.model(**inputs)
            
            # 결과 처리
            return self.processor.decode(outputs.logits.argmax(-1)[0])
            
        except Exception as e:
            raise Exception(f"Image analysis failed: {str(e)}")

    def get_openai_analysis(self, 
                          question_data: Dict[str, Any], 
                          extracted_text: str, 
                          omniparser_result: str) -> Dict[str, Any]:
        """OpenAI API를 사용하여 분석 결과 생성"""
        try:
            prompt = f"""
문제 정보:
제목: {question_data.get('title', '제목 없음')}
시험 유형: {question_data.get('examType', '미지정')}
과목: {question_data.get('subject', '미지정')}

추출된 문제 텍스트:
{extracted_text}

OmniParser 분석 결과:
{omniparser_result}

위 문제에 대해 다음을 분석해주세요:
1. 문제의 핵심 개념
2. 해결 방법 제안
3. 관련된 주요 개념이나 이론
4. 학습 포인트
"""

            response = openai.ChatCompletion.create(
                model="gpt-4",  # 또는 다른 적절한 모델
                messages=[
                    {"role": "system", "content": "당신은 학습 도우미입니다. 주어진 문제를 분석하고 도움이 되는 해설을 제공합니다."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )

            return {
                'analysis': response.choices[0].message.content,
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }

        except Exception as e:
            raise Exception(f"OpenAI analysis failed: {str(e)}")

    async def process_question(self, 
                             question_data: Dict[str, Any], 
                             image_url: Optional[str] = None) -> Dict[str, Any]:
        """전체 처리 프로세스 실행"""
        try:
            results = {
                'original_question': question_data,
                'omniparser_result': None,
                'openai_analysis': None
            }

            # 이미지가 있는 경우 OmniParser 분석 실행
            if image_url:
                results['omniparser_result'] = self.analyze_image(
                    image_url, 
                    question_data.get('content', '')
                )

            # OpenAI 분석 실행
            results['openai_analysis'] = self.get_openai_analysis(
                question_data,
                question_data.get('extractedText', ''),
                results.get('omniparser_result', '')
            )

            return results

        except Exception as e:
            raise Exception(f"Question processing failed: {str(e)}")

# 사용 예시
"""
service = QuestionAnalysisService('your-openai-api-key')

question_data = {
    'title': '미분 계수 문제',
    'examType': '수능',
    'subject': '수학',
    'content': '다음 함수의 미분 계수를 구하시오.',
    'extractedText': '문제 전문...'
}

results = await service.process_question(
    question_data,
    image_url='https://example.com/question-image.jpg'
)
"""