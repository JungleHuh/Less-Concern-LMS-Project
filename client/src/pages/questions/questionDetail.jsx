// pages/questions/QuestionDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionByIdService, addAnswerService } from '@/services/question';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function QuestionDetail() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await getQuestionByIdService(questionId);
        if (response.success) {
          setQuestion(response.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "오류",
          description: "질문을 불러오는데 실패했습니다."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, toast]);

  const handleSubmitAnswer = async () => {
    try {
      const response = await addAnswerService(questionId, { content: answer });
      if (response.success) {
        toast({
          title: "등록 완료",
          description: "답변이 등록되었습니다."
        });
        setAnswer('');
        // 질문 정보 새로고침
        const updatedQuestion = await getQuestionByIdService(questionId);
        setQuestion(updatedQuestion.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "답변 등록에 실패했습니다."
      });
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!question) {
    return <div>질문을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{question.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                {new Date(question.createdAt).toLocaleString()}
              </div>
            </div>
            <Badge variant={question.status === 'resolved' ? 'success' : 'secondary'}>
              {question.status === 'resolved' ? '해결됨' : '미해결'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 원본 이미지 */}
          {question.imageUrl && (
            <img 
              src={question.imageUrl} 
              alt="Question" 
              className="max-h-96 object-contain"
            />
          )}

          {/* 추출된 텍스트 */}
          {question.extractedText && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">추출된 텍스트</h3>
              <p className="whitespace-pre-wrap">{question.extractedText}</p>
            </div>
          )}

          {/* 질문 내용 */}
          <div className="prose max-w-none">
            <p>{question.content}</p>
          </div>

          {/* 답변 목록 */}
          <div className="space-y-4">
            <h3 className="font-medium">
              답변 {question.answers?.length || 0}개
            </h3>
            {question.answers?.map((answer) => (
              <Card key={answer._id}>
                <CardContent className="pt-6">
                  <p>{answer.content}</p>
                  <div className="text-sm text-muted-foreground mt-4">
                    {new Date(answer.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 답변 작성 */}
          <div className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="답변을 작성해주세요"
              rows={4}
            />
            <Button 
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
            >
              답변 등록
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}