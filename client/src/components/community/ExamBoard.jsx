import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';
import { getPosts } from '@/services/posts'; // API 서비스 추가
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// src/components/ExamBoard.jsx
function ExamBoard({ examType, onPostClick }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const boardConfig = EXAM_CONFIG[examType];

  // 게시글 목록 조회
  const fetchPosts = async () => {
      try {
          setLoading(true);
          setError(null);
          
          console.log('Fetching posts for examType:', examType);
          
          const response = await getPosts(examType);
          
          if (response.success) {
              setPosts(response.data);
          }
      } catch (error) {
          console.error('Error:', error);
          setError('게시글을 불러오는데 실패했습니다.');
          toast.error('게시글을 불러오는데 실패했습니다.');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      if (examType) {
          fetchPosts();
      }
  }, [examType]);

  if (!boardConfig) {
      return <div>존재하지 않는 게시판입니다.</div>;
  }

  if (loading) {
      return <div>Loading...</div>;
  }

  return (
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>{boardConfig.title} 게시판</CardTitle>
                  <p className="text-muted-foreground mt-2">{boardConfig.description}</p>
              </div>
              <Button onClick={() => navigate(`/community/${examType}/write`)}>
                  글쓰기
              </Button>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[100px]">번호</TableHead>
                          <TableHead>제목</TableHead>
                          <TableHead className="w-[150px]">작성자</TableHead>
                          <TableHead className="w-[150px]">작성일</TableHead>
                          <TableHead className="w-[100px]">조회수</TableHead>
                          <TableHead className="w-[100px]">댓글</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {posts.map((post, index) => (
                          <TableRow key={post._id || index}>
                              <TableCell>{posts.length - index}</TableCell>
                              <TableCell 
                                  className="font-medium cursor-pointer hover:text-primary"
                                  onClick={() => onPostClick(post)}
                              >
                                  {post.title}
                              </TableCell>
                              <TableCell>{post.author?.userName}</TableCell>
                              <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>{post.views || 0}</TableCell>
                              <TableCell>
                                  <Badge variant="secondary">
                                      {post.comments?.length || 0}
                                  </Badge>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>

              {posts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                      게시글이 없습니다.
                  </div>
              )}
          </CardContent>
      </Card>
  );
}

export default ExamBoard;