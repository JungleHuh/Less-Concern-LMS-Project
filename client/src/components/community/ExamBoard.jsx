/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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

// src/components/community/ExamBoard.jsx
export default function ExamBoard() {
    const navigate = useNavigate();
    const { examType } = useParams();
    const [posts, setPosts] = useState([]);  // 빈 배열로 초기화
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const boardConfig = EXAM_CONFIG[examType];

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching posts for examType:', examType);
            
            const response = await getPosts(examType);
            console.log('Posts response:', response);  // 디버깅용
            
            if (response.success) {
                // 응답 데이터가 배열인지 확인
                const postsData = Array.isArray(response.data) ? response.data : [];
                setPosts(postsData);
            } else {
                setError(response.error);
                toast.error(response.error);
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
        if (examType && boardConfig) {
            fetchPosts();
        }
    }, [examType]);

    if (!boardConfig) {
        console.log('Board config not found for:', examType);
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
                        {Array.isArray(posts) && posts.length > 0 ? (
                            posts.map((post, index) => (
                                <TableRow key={post._id || index}>
                                    <TableCell>{posts.length - index}</TableCell>
                                    <TableCell 
                                        className="font-medium cursor-pointer hover:text-primary"
                                        onClick={() => navigate(`/community/${examType}/post/${post._id}`)}
                                    >
                                        {post.title}
                                    </TableCell>
                                    <TableCell>{post.author?.userName}</TableCell>
                                    <TableCell>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{post.views || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {post.comments?.length || 0}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    게시글이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}