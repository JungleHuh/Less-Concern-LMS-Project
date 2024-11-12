// pages/questions/QuestionForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createQuestionService } from '@/services/question';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuestionForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      examType: '',
      subject: ''
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // 기본 데이터 추가
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // 이미지 추가
      const imageFile = document.querySelector('input[type="file"]').files[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await createQuestionService(formData);
      if (response.success) {
        toast({
          title: "등록 완료",
          description: "질문이 등록되었습니다."
        });
        // 목록 페이지로 이동
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
    <Card>
      <CardHeader>
        <CardTitle>문제 질문하기</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...form.register('title')}
            placeholder="제목"
          />
          
          <Select
            onValueChange={(value) => form.setValue('examType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="시험 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpa">공인회계사</SelectItem>
              <SelectItem value="tax">세무사</SelectItem>
              {/* 더 많은 옵션... */}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => form.setValue('subject', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="과목" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">재무회계</SelectItem>
              <SelectItem value="tax">세무회계</SelectItem>
              {/* 더 많은 옵션... */}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-48 object-contain"
              />
            )}
          </div>

          <Textarea
            {...form.register('content')}
            placeholder="질문 내용을 작성해주세요."
            rows={6}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "등록 중..." : "질문하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}