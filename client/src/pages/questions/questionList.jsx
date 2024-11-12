// pages/questions/QuestionList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestionsService } from '@/services/question';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getQuestionsService();
        if (response.success) {
          setQuestions(response.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "오류",
          description: "질문 목록을 불러오는데 실패했습니다."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">문제 질문</h1>
        <Button onClick={() => navigate('/questions/new')}>
          질문하기
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <Card 
            key={question._id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/questions/${question._id}`)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {question.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {question.content}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={question.status === 'resolved' ? 'success' : 'secondary'}>
                    {question.status === 'resolved' ? '해결됨' : '미해결'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    답변 {question.answers?.length || 0}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{question.examType}</span>
                  <span>{question.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>조회 {question.views}</span>
                  <span>•</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}