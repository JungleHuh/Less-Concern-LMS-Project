import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestionsService, searchQuestionsService } from '@/services/question';
import { useToast } from "@/hooks/use-toast";
import QuestionForm from './index';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Plus, Brain } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function QuestionList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    examType: 'all',
    subject: 'all',
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };

      // 'all' 값은 API 요청에서 제외
      if (params.examType === 'all') delete params.examType;
      if (params.subject === 'all') delete params.subject;
      if (params.status === 'all') delete params.status;
      if (!params.keyword.trim()) delete params.keyword;

      const response = filters.keyword
        ? await searchQuestionsService(params)
        : await getQuestionsService(params);

      if (response.success) {
        const questionData = response.data.questions || response.data || [];
        setQuestions(questionData);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil((response.data.total || questionData.length) / prev.itemsPerPage),
          totalItems: response.data.total || questionData.length
        }));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        variant: "destructive",
        title: "오류",
        description: "질문 목록을 불러오는데 실패했습니다."
      });
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.itemsPerPage, toast]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  const onQuestionCreated = () => {
    setShowForm(false);
    fetchQuestions();
  };

  if (showForm) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={toggleForm}
            className="mb-6"
          >
            목록으로 돌아가기
          </Button>
        </div>
        <QuestionForm onSuccess={onQuestionCreated} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">문제 질문</CardTitle>
        <Button onClick={toggleForm}>
          <Plus className="mr-2 h-4 w-4" />
          질문하기
        </Button>
      </div>

      {/* 검색 및 필터 섹션 */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="검색어를 입력하세요"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
              />
              
              <Select
                value={filters.examType}
                onValueChange={(value) => handleFilterChange('examType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시험 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="cpa">공인회계사</SelectItem>
                  <SelectItem value="tax">세무사</SelectItem>
                  <SelectItem value="cta">관세사</SelectItem>
                  <SelectItem value="labor">공인노무사</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.subject}
                onValueChange={(value) => handleFilterChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="과목" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="financial">재무회계</SelectItem>
                  <SelectItem value="tax">세무회계</SelectItem>
                  <SelectItem value="management">관리회계</SelectItem>
                  <SelectItem value="audit">회계감사</SelectItem>
                  <SelectItem value="business">경영학</SelectItem>
                  <SelectItem value="commercial">상법</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">미해결</SelectItem>
                  <SelectItem value="resolved">해결됨</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              검색
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 질문 목록 섹션 */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : Array.isArray(questions) && questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card 
              key={question._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/questions/${question._id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      {question.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2">
                      {question.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={question.status === 'resolved' ? 'success' : 'secondary'}>
                        {question.status === 'resolved' ? '해결됨' : '미해결'}
                      </Badge>
                      {question.analysis && (
                        <Badge variant="outline">
                          <Brain className="mr-1 h-3 w-3" />
                          AI 분석
                        </Badge>
                      )}
                    </div>
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

          {/* 페이지네이션 */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}