import { useState, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';
import ExamBoard from '@/components/community/ExamBoard';
import PostDetail from './community-view.jsx';
import { toast } from '@/hooks/use-toast.js';

export default function ExamCommunityHome() {
   const { auth, resetCredentials } = useContext(AuthContext);
   const navigate = useNavigate();
   const [selectedBoard, setSelectedBoard] = useState(null);
   const [selectedPost, setSelectedPost] = useState(null);

   console.log("현재 auth 상태:", auth);

   const handleLogout = () => {
       if(window.confirm('로그아웃 하시겠습니까?')) {
           resetCredentials();
           sessionStorage.removeItem('accessToken');
       }
   };

   // 게시판 선택 핸들러
   const handleBoardClick = (board) => {
    console.log('Clicked board:', board);  // 디버깅용
    
    if (EXAM_CONFIG[board.type]) {
        // URL 이동 추가
        navigate(`/community/${board.type}`);
        setSelectedBoard(board);
        setSelectedPost(null);
    } else {
        toast.error('존재하지 않는 게시판입니다.');
    }
};

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

   const examBoards = Object.values(EXAM_CONFIG).map(exam => ({
       ...exam,
       posts: 150,
       upcomingDate: 'D-30'
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
                           {auth.authenticate && auth.user ? (
                               // 로그인 상태
                               <div className="space-y-4">
                                   <div className="flex items-center justify-between">
                                       <div>
                                           <h3 className="font-medium">{auth.user.userName}님</h3>
                                           <p className="text-sm text-muted-foreground">
                                               {auth.user.email}
                                           </p>
                                       </div>
                                       <Button 
                                           variant="outline"
                                           size="sm"
                                           onClick={handleLogout}
                                       >
                                           로그아웃
                                       </Button>
                                   </div>
                                   
                                   <div className="grid grid-cols-2 gap-2">
                                       <Button 
                                           variant="ghost"
                                           className="w-full"
                                           onClick={() => navigate('/mypage')}
                                       >
                                           마이페이지
                                       </Button>
                                       <Button 
                                           variant="ghost"
                                           className="w-full"
                                           onClick={() => navigate('/notifications')}
                                       >
                                           알림
                                       </Button>
                                   </div>

                                   <Separator />

                                   <div className="space-y-2">
                                       <div className="flex justify-between text-sm">
                                           <span>내 게시글</span>
                                           <span className="font-medium">
                                               {auth.user.posts || 0}개
                                           </span>
                                       </div>
                                       <div className="flex justify-between text-sm">
                                           <span>내 댓글</span>
                                           <span className="font-medium">
                                               {auth.user.comments || 0}개
                                           </span>
                                       </div>
                                   </div>
                               </div>
                           ) : (
                               // 비로그인 상태
                               <div className="space-y-4">
                                   <Button 
                                       className="w-full"
                                       onClick={() => navigate('/auth')}
                                   >
                                       로그인
                                   </Button>
                                   <div className="flex justify-between mt-4 text-sm">
                                       <span 
                                           className="text-muted-foreground cursor-pointer"
                                           onClick={() => navigate('/auth/register')}
                                       >
                                           회원가입
                                       </span>
                                       <span 
                                           className="text-muted-foreground cursor-pointer"
                                           onClick={() => navigate('/auth/find')}
                                       >
                                           ID/PW 찾기
                                       </span>
                                   </div>
                               </div>
                           )}
                       </CardContent>
                   </Card>

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
                onClick={() => handleBoardClick(board)}
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
               <div className="lg:col-span-3 space-y-6">
    {selectedBoard ? (
        selectedPost ? (
            <PostDetail 
                post={selectedPost}
                onBack={() => setSelectedPost(null)}
            />
        ) : (
            <ExamBoard 
                examType={selectedBoard.type}
                onPostClick={(post) => setSelectedPost(post)}
                key={selectedBoard.type}
            />
        )
    ) : (
                       <>
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
                       </>
                   )}
               </div>
           </div>
       </div>
   );
}