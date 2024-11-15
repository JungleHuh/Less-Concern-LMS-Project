// services/question-analysis-service.js
const OpenAI = require('openai');
const OmniParserService = require('./omniparser-service');

class QuestionAnalysisService {
  constructor(openaiApiKey) {
    // OpenAI 초기화
    this.openai = new OpenAI({
      apiKey: openaiApiKey
    });
    
    // OmniParser 서비스 초기화
    this.omniParser = new OmniParserService();
  }

  async analyzeImage(imageUrl) {
    try {
      // 기본 질문 설정
      const defaultQuestion = "What is shown in this math/accounting problem image? Please provide a detailed explanation.";
      
      // OmniParser를 사용하여 이미지 분석
      const result = await this.omniParser.analyze_image(imageUrl, defaultQuestion);
      return result;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('이미지 분석에 실패했습니다.');
    }
  }

  async getOpenAIAnalysis(questionData) {
    try {
      const prompt = `
아래 회계/세무 문제에 대해 분석해주세요:

제목: ${questionData.title}
시험 유형: ${questionData.examType}
과목: ${questionData.subject}

문제 내용:
${questionData.content}

추출된 텍스트:
${questionData.extractedText}

이미지 분석 결과:
${questionData.omniparserResult}

다음 형식으로 분석해주세요:
1. 핵심 개념: (이 문제에서 다루는 주요 회계/세무 개념)
2. 해결 방법: (문제 해결을 위한 단계별 접근 방법)
3. 관련 개념: (이 문제와 연관된 다른 중요 개념들)
4. 학습 포인트: (이 문제를 통해 학습해야 할 중요 포인트)
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",  // GPT-4에서 GPT-3.5-turbo로 변경
        messages: [
          {
            role: "system",
            content: "당신은 회계/세무 전문가입니다. 학습자가 문제를 깊이 이해하고 해결할 수 있도록 도와주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000  // 토큰 수 증가
      });

      const analysisText = completion.choices[0].message.content;
      
      // 섹션별로 분리
      const sections = {
        coreConcepts: '',
        solution: '',
        relatedConcepts: '',
        learningPoints: ''
      };

      // 텍스트를 섹션별로 파싱
      const lines = analysisText.split('\n');
      let currentSection = '';
      
      lines.forEach(line => {
        if (line.includes('핵심 개념:')) {
          currentSection = 'coreConcepts';
        } else if (line.includes('해결 방법:')) {
          currentSection = 'solution';
        } else if (line.includes('관련 개념:')) {
          currentSection = 'relatedConcepts';
        } else if (line.includes('학습 포인트:')) {
          currentSection = 'learningPoints';
        } else if (currentSection && line.trim()) {
          sections[currentSection] += line.trim() + '\n';
        }
      });

      // 각 섹션의 마지막 줄바꿈 제거
      Object.keys(sections).forEach(key => {
        sections[key] = sections[key].trim();
      });

      return sections;
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      if (error.code === 'model_not_found') {
        throw new Error('OpenAI API 모델 접근 권한이 없습니다.');
      }
      throw new Error('AI 분석에 실패했습니다.');
    }
  }

  async analyzeQuestion(questionData) {
    try {
      let analysisResult = {
        omniparserResult: null,
        openaiAnalysis: null,
        timestamp: new Date()
      };

      // 이미지가 있는 경우 OmniParser 분석 실행
      if (questionData.imageUrl) {
        analysisResult.omniparserResult = await this.analyzeImage(questionData.imageUrl);
      }

      // OpenAI 분석 실행
      analysisResult.openaiAnalysis = await this.getOpenAIAnalysis({
        ...questionData,
        omniparserResult: analysisResult.omniparserResult
      });

      return analysisResult;
    } catch (error) {
      console.error('Question analysis error:', error);
      throw error;
    }
  }
}

module.exports = {
  QuestionAnalysisService
};