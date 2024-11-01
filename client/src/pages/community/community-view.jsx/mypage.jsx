// src/pages/mypage/index.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import { getUserPosts, getUserStats } from '@/services/mypage';
import { toast } from "react-hot-toast";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MyPage() {
 const { auth } = useContext(AuthContext);
 const [stats, setStats] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchStats = async () => {
     try {
       const response = await getUserStats();
       if (response.success) {
         setStats(response.data);
       } else {
         toast.error(response.error);
       }
     } catch (error) {
       toast.error('통계를 불러오는데 실패했습니다.');
     } finally {
       setLoading(false);
     }
   };

   fetchStats();
 }, []);

 if (loading) {
   return <div>Loading...</div>;
 }

 return (
   <div className="container mx-auto py-6 max-w-5xl">
     {/* 프로필 섹션 */}
     <Card className="mb-6">
       <CardHeader>
         <CardTitle>내 프로필</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="grid gap-4">
           <div>
             <h3 className="font-medium text-lg">{auth.user?.userName}</h3>
             <p className="text-muted-foreground">{auth.user?.email}</p>
           </div>
           <Separator />
           <div className="space-y-2">
             <div className="flex justify-between">
               <span>작성한 게시글</span>
               <span className="font-medium">{stats?.postsCount || 0}개</span>
             </div>
           </div>
         </div>
       </CardContent>
     </Card>

     {/* 내 게시글 목록 */}
     <MyPosts />
   </div>
 );
}

function MyPosts() {
 const navigate = useNavigate();
 const [posts, setPosts] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchPosts = async () => {
     try {
       setLoading(true);
       const response = await getUserPosts();
       if (response.success) {
         setPosts(response.data);
       } else {
         toast.error(response.error);
       }
     } catch (error) {
       toast.error('게시글을 불러오는데 실패했습니다.');
     } finally {
       setLoading(false);
     }
   };

   fetchPosts();
 }, []);

 if (loading) return <div>Loading...</div>;

 return (
   <Card>
     <CardHeader>
       <CardTitle>내가 쓴 글</CardTitle>
     </CardHeader>
     <CardContent>
       <div className="space-y-4">
         {posts.length > 0 ? (
           posts.map((post) => (
             <div 
               key={post._id} 
               className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
               onClick={() => navigate(`/community/${post.examType}/post/${post._id}`)}
             >
               <div className="flex items-center gap-2 mb-2">
                 <Badge>{post.examType}</Badge>
                 <Badge variant="outline">{post.category}</Badge>
                 <span className="text-sm text-muted-foreground">
                   {new Date(post.createdAt).toLocaleDateString()}
                 </span>
               </div>
               <h3 className="font-medium mb-2">{post.title}</h3>
               <div className="flex items-center gap-4 text-sm text-muted-foreground">
                 <span>조회 {post.views || 0}</span>
                 <span>댓글 {post.comments?.length || 0}</span>
               </div>
             </div>
           ))
         ) : (
           <div className="text-center py-8 text-muted-foreground">
             작성한 게시글이 없습니다.
           </div>
         )}
       </div>
     </CardContent>
   </Card>
 );
}