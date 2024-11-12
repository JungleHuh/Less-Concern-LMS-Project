# python/main.py
import easyocr
import sys
import json
import requests
from PIL import Image
from io import BytesIO
import ssl
import certifi

def analyze_image(image_url):
    try:
        # SSL 인증서 검증 설정
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        
        # requests에 SSL 인증서 설정 추가
        response = requests.get(
            image_url,
            verify=certifi.where()
        )
        
        image = Image.open(BytesIO(response.content))
        
        # 이미지를 임시 파일로 저장
        temp_path = 'temp_image.png'
        image.save(temp_path)

        # EasyOCR 리더 초기화
        reader = easyocr.Reader(['ko', 'en'], download_enabled=True)
        
        # 텍스트 추출
        result = reader.readtext(temp_path)
        
        # 결과 텍스트 조합
        text = ' '.join([item[1] for item in result])
        
        return text

    except Exception as e:
        raise Exception(f"Image analysis failed: {str(e)}")

# python/main.py
def main():
    try:
        if len(sys.argv) < 2:
            raise Exception("Missing required argument: image_url")

        image_url = sys.argv[1]
        result = analyze_image(image_url)

        # 결과 출력 전에 다른 출력 없도록 함
        sys.stdout.flush()
        print(json.dumps({
            'success': True,
            'result': result
        }), flush=True)

    except Exception as e:
        sys.stderr.flush()
        print(json.dumps({
            'success': False,
            'error': str(e)
        }), file=sys.stderr, flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()