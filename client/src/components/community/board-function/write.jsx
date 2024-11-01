import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast"; 
import { createPost } from '@/services/posts'; 

function WritePost() {
  const navigate = useNavigate();
  const { examType } = useParams();
  const boardConfig = EXAM_CONFIG[examType];
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;

    try {
      setLoading(true);
      
      const response = await createPost({
        ...formData,
        examType,
      });

      if (response.success) {
        toast.success('게시글이 작성되었습니다.');
        navigate(`/community/${examType}`);
      } else {
        throw new Error(response.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('작성 중인 내용이 있습니다. 취소하시겠습니까?')) {
        navigate(`/community/${examType}`);
      }
    } else {
      navigate(`/community/${examType}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{boardConfig.title} 게시판 글쓰기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 카테고리 선택 */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {boardConfig.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 제목 입력 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                required
                maxLength={100} // 제목 길이 제한
              />
            </div>

            {/* 내용 입력 */}
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                rows={15}
                required
                className="min-h-[400px] resize-none"
                maxLength={10000} // 내용 길이 제한
              />
            </div>

            {/* 파일 첨부 */}
            <div className="space-y-2">
              <Label htmlFor="file">파일 첨부</Label>
              <Input
                id="file"
                type="file"
                multiple
                className="cursor-pointer"
                onChange={(e) => {
                  // 파일 개수 제한
                  if (e.target.files.length > 3) {
                    toast.error('최대 3개까지 첨부 가능합니다.');
                    e.target.value = '';
                  }
                }}
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx" // 허용 파일 형식
              />
              <p className="text-sm text-muted-foreground">
                최대 3개까지 첨부 가능합니다. (jpg, png, gif, pdf, doc 파일)
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              취소
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className={loading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? '등록 중...' : '등록'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default WritePost;