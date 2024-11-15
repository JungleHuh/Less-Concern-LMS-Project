// pages/questions/QuestionForm.jsx
import { useState } from 'react';
import { createQuestionService } from '@/services/question';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

export default function QuestionForm({ onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    examType: '',
    subject: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          variant: "destructive",
          title: "파일 크기 초과",
          description: "이미지 크기는 5MB 이하여야 합니다."
        });
        e.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "잘못된 파일 형식",
          description: "이미지 파일만 업로드 가능합니다."
        });
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "제목을 입력해주세요."
      });
      return false;
    }

    if (!formData.examType) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "시험 유형을 선택해주세요."
      });
      return false;
    }

    if (!formData.subject) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "과목을 선택해주세요."
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "질문 내용을 입력해주세요."
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const submitFormData = new FormData();
      
      // 기본 데이터 추가
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });
      
      // 이미지 추가
      const imageFile = document.querySelector('input[type="file"]').files[0];
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const response = await createQuestionService(submitFormData);
      if (response.success) {
        toast({
          title: "등록 완료",
          description: "질문이 등록되었습니다. AI 분석이 자동으로 시작됩니다."
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: error.message || "질문 등록에 실패했습니다."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>문제 질문하기</CardTitle>
          <CardDescription>
            문제 이미지와 함께 질문을 작성해주세요. AI가 자동으로 분석을 시작합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="질문의 제목을 입력해주세요"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>시험 유형</Label>
              <Select
                value={formData.examType}
                onValueChange={(value) => handleChange('examType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시험 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpa">공인회계사</SelectItem>
                  <SelectItem value="tax">세무사</SelectItem>
                  <SelectItem value="cta">관세사</SelectItem>
                  <SelectItem value="labor">공인노무사</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>과목</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="과목을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">재무회계</SelectItem>
                  <SelectItem value="tax">세무회계</SelectItem>
                  <SelectItem value="management">관리회계</SelectItem>
                  <SelectItem value="audit">회계감사</SelectItem>
                  <SelectItem value="business">경영학</SelectItem>
                  <SelectItem value="commercial">상법</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>문제 이미지</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-medium
                           file:bg-primary file:text-primary-foreground
                           hover:file:bg-primary/90"
                />
                {imagePreview && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setImagePreview(null);
                      document.querySelector('input[type="file"]').value = '';
                    }}
                  >
                    이미지 제거
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-4 border rounded-lg p-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-96 object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">질문 내용</Label>
              <Textarea 
                id="content"
                placeholder="질문 내용을 자세히 작성해주세요." 
                className="min-h-[150px]"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  질문하기
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}