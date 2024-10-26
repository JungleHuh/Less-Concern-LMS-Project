import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';

function ExamCommunityHome() {
    // 공지사항
    const notices = [
        { id: 1, title: '[필독] 커뮤니티 이용규칙 안내', date: '2024.03.20' },
        { id: 2, title: '[공지] 2024 자격증 시험일정 총정리', date: '2024.03.19' }
    ];

    // 인기 게시글
    const hotTopics = [
        { 
            id: 1, 
            title: '2024 공인회계사 1차 시험 후기',
            views: 1502,
            comments: 234,
            isHot: true,
            category: '공인회계사'
        },
        { 
            id: 2, 
            title: '변호사시험 스터디원 모집합니다',
            views: 982,
            comments: 145,
            isPinned: true,
            category: '변호사시험'
        }
    ];

    // 최신글
    const recentPosts = [
        {
            id: 1,
            category: '공인회계사',
            title: '회계감사 기출문제 분석',
            author: '열공맨',
            views: 324,
            comments: 45,
            timestamp: '10분 전'
        },
        {
            id: 2,
            category: '변호사시험',
            title: '상법 기출 정리노트 공유',
            author: '로스쿨러',
            views: 156,
            comments: 23,
            timestamp: '30분 전'
        }
    ];

    // 시험 일정
    const upcomingExams = [
        {
            id: 1,
            title: '2024 공인회계사 2차 시험',
            date: '2024.06.29',
            dDay: 'D-100',
        },
        {
            id: 2,
            title: '2024 변호사시험',
            date: '2024.07.15',
            dDay: 'D-115',
        }
    ];
        const navigate = useNavigate();

        const examBoards = Object.values(EXAM_CONFIG).map(exam => ({
            ...exam,
            posts: 150, // 또는 실제 데이터
            upcomingDate: 'D-30' // 또는 실제 데이터
          }));
        

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* 상단 배너 */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-40 rounded-lg mb-6 flex items-end">
                <div className="w-full bg-black/50 p-4 rounded-b-lg">
                    <h1 className="text-white text-2xl font-bold">자격증 시험 커뮤니티</h1>
                    <p className="text-white/80 mt-2">함께 공부하고 정보를 나눠요!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 왼쪽 사이드바 */}
                <div className="lg:col-span-1 space-y-6">
                    {/* 로그인 카드 */}
                    <Card>
                        <CardContent className="p-4">
                            <Button 
                            className="w-full"
                            onClick={() => navigate('/auth')}
                            >
                                로그인</Button>
                            <div className="flex justify-between mt-4 text-sm">
                                <span className="text-muted-foreground">회원가입</span>
                                <span className="text-muted-foreground">ID/PW 찾기</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 시험별 게시판 로직 -> 이걸 컴포넌트로 단순화시키고 싶단 말이지...
                    어차피 시험 종류들도 추가해야 되서.... 물론 50개 이상은 안되겠지만.. */}
                    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          📚 시험별 게시판
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {examBoards.map(board => (
          <div 
            key={board.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-accent cursor-pointer"
            onClick={() => navigate(`/community/${board.type}`)}
          >
            <span className="flex items-center gap-2">
              ✏️ {board.name}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{board.upcomingDate}</Badge>
              <Badge variant="secondary">{board.posts}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 공지사항 */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                📌 공지사항
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {notices.map(notice => (
                                <div key={notice.id} className="flex justify-between py-2">
                                    <span className="text-primary hover:underline cursor-pointer">
                                        {notice.title}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {notice.date}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 인기 게시글 */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                🔥 HOT 게시글
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hotTopics.map(topic => (
                                <div key={topic.id} className="py-3">
                                    <div className="flex items-center gap-2">
                                        <Badge>{topic.category}</Badge>
                                        {topic.isHot && (
                                            <Badge variant="destructive">HOT</Badge>
                                        )}
                                        {topic.isPinned && (
                                            <Badge variant="secondary">주목</Badge>
                                        )}
                                        <h3 className="font-medium hover:text-primary cursor-pointer">
                                            {topic.title}
                                        </h3>
                                    </div>
                                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            👁️ {topic.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💬 {topic.comments}
                                        </span>
                                    </div>
                                    <Separator className="mt-3" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 최신글 */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                ⏰ 최신글
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentPosts.map(post => (
                                <div key={post.id} className="py-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline">{post.category}</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {post.author}
                                        </span>
                                    </div>
                                    <h3 className="font-medium hover:text-primary cursor-pointer">
                                        {post.title}
                                    </h3>
                                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>{post.timestamp}</span>
                                        <span className="flex items-center gap-1">
                                            👁️ {post.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💬 {post.comments}
                                        </span>
                                    </div>
                                    <Separator className="mt-3" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 오른쪽 사이드바 */}
                <div className="lg:col-span-1 space-y-6">
                    {/* 시험 일정 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                📅 시험 일정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {upcomingExams.map(exam => (
                                <div 
                                    key={exam.id}
                                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">{exam.title}</h3>
                                        <Badge variant="secondary">{exam.dDay}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {exam.date}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 스터디 모집 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                👥 스터디 모집
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {[1,2,3].map(i => (
                                <div 
                                    key={i}
                                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                                >
                                    <h3 className="text-sm">회계사 1차 온라인 스터디</h3>
                                    <span className="text-xs text-muted-foreground">모집중 • 3/5명</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ExamCommunityHome;