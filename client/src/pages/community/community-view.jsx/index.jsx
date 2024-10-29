// src/components/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '@/services/posts';
import { EXAM_CONFIG } from '@/config/board';
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function PostDetail() {
  const navigate = useNavigate();
  const { examType, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPost(postId);
        if (response.success) {
          setPost(response.data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('게시글을 불러오는데 실패했습니다.');
        navigate(`/community/${examType}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, examType]);

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await deletePost(postId);
        if (response.success) {
          toast.success('게시글이 삭제되었습니다.');
          navigate(`/community/${examType}`);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge>{post.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
        <div className="flex items-center justify-between text-sm">
          <span>작성자: {post.author?.userName}</span>
          <span>조회수: {post.views}</span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="py-8 min-h-[300px] whitespace-pre-wrap">
        {post.content}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between p-4">
        <Button 
          variant="outline"
          onClick={() => navigate(`/community/${examType}`)}
        >
          목록으로
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/community/${examType}/edit/${postId}`)}
          >
            수정
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostDetail;