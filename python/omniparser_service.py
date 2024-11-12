# python/omniparser_service.py
from transformers import AutoProcessor, AutoModelForVisualQuestionAnswering
from PIL import Image
import torch
import requests
from io import BytesIO

class OmniParserService:
    def __init__(self):
        self.processor = AutoProcessor.from_pretrained("microsoft/OmniParser")
        self.model = AutoModelForVisualQuestionAnswering.from_pretrained("microsoft/OmniParser")
        
        # GPU 사용 가능시 GPU로 모델 이동
        if torch.cuda.is_available():
            self.model = self.model.to('cuda')
            
    def analyze_image(self, image_url, question):
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
            predicted_answer = self.processor.decode(outputs.logits.argmax(-1)[0])
            
            return predicted_answer
            
        except Exception as e:
            raise Exception(f"Image analysis failed: {str(e)}")